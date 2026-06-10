import { createClient } from "npm:@supabase/supabase-js@2";
import { timingSafeEqual } from "../_shared/crypto.ts";
import { extractRulesEngineSecretCandidate } from "../_shared/rules-engine-secret.ts";
import { getCorsHeaders } from "../_shared/http.ts";

interface RuleResult {
  userId: string;
  type: string;
  title: string;
  description: string;
  tripId?: string;
  actionUrl?: string;
  priority?: number;
}

function rulesEngineJsonResponse(
  body: unknown,
  status: number,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** True if caller sent a non-empty rules-engine credential (header or Bearer token). */
function hasRulesEngineCredentialAttempt(headers: Headers): boolean {
  const x = headers.get("x-rules-engine-secret");
  if (x != null && x.trim().length > 0) return true;
  const auth = headers.get("Authorization");
  const m = auth?.match(/^Bearer\s*(.*)$/i);
  if (!m) return false;
  return String(m[1] ?? "").trim().length > 0;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  /** Prefer RULES_ENGINE_SECRET; legacy alias RULES_ENGINE_CRON_SECRET (01-plan / pg_cron patterns). */
  const rulesSecret = Deno.env.get("RULES_ENGINE_SECRET") ??
    Deno.env.get("RULES_ENGINE_CRON_SECRET");

  if (rulesSecret) {
    const provided = extractRulesEngineSecretCandidate(req.headers);
    if (!hasRulesEngineCredentialAttempt(req.headers)) {
      return rulesEngineJsonResponse(
        {
          error: "Unauthorized",
          message: "Missing rules engine credentials (x-rules-engine-secret or Bearer)",
        },
        401,
        corsHeaders,
      );
    }
    if (!timingSafeEqual(provided, rulesSecret)) {
      return rulesEngineJsonResponse(
        { error: "Forbidden", message: "Invalid rules engine credentials" },
        403,
        corsHeaders,
      );
    }
  } else {
    console.warn(
      "[rules-engine] RULES_ENGINE_SECRET (or RULES_ENGINE_CRON_SECRET) not set — calls are not authenticated",
    );
  }

  if (req.method === "POST") {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const raw = await req.text();
      if (raw.trim() !== "") {
        try {
          JSON.parse(raw) as unknown;
        } catch {
          return rulesEngineJsonResponse(
            { error: "Bad Request", message: "Invalid JSON body" },
            400,
            corsHeaders,
          );
        }
      }
    }
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const suggestions: RuleResult[] = [];
    const now = new Date();

    // ============================================
    // RULE 1: Empty Day Detection
    // Find trips with days that have no items
    // ============================================
    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select(`
        id,
        title,
        user_id,
        start_date,
        end_date,
        trip_items (
          id,
          start_at
        )
      `)
      .eq("status", "active")
      .is("deleted_at", null)
      .gte("end_date", now.toISOString().split("T")[0]);

    if (tripsError) {
      console.error("Error fetching trips:", tripsError);
    } else if (trips) {
      for (const trip of trips) {
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // Get days with items
        const daysWithItems = new Set<number>();
        for (const item of trip.trip_items || []) {
          if (item.start_at) {
            const itemDate = new Date(item.start_at);
            const dayIndex = Math.floor((itemDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < totalDays) {
              daysWithItems.add(dayIndex);
            }
          }
        }

        // Find empty days
        const emptyDays: number[] = [];
        for (let i = 0; i < totalDays; i++) {
          if (!daysWithItems.has(i)) {
            emptyDays.push(i + 1); // 1-indexed for display
          }
        }

        if (emptyDays.length > 0 && emptyDays.length < totalDays) {
          const dayText = emptyDays.length === 1 
            ? `Day ${emptyDays[0]}` 
            : `Days ${emptyDays.slice(0, 3).join(", ")}${emptyDays.length > 3 ? ` and ${emptyDays.length - 3} more` : ""}`;
          
          suggestions.push({
            userId: trip.user_id,
            type: "empty_day",
            title: `Empty day in ${trip.title}`,
            description: `${dayText} ${emptyDays.length === 1 ? "has" : "have"} no activities planned. Add some experiences!`,
            tripId: trip.id,
            actionUrl: `/trips/${trip.id}`,
            priority: 7,
          });
        }
      }
    }

    // ============================================
    // RULE 2: Budget Threshold Alert
    // Notify when spending exceeds 80% of budget
    // ============================================
    const { data: budgets, error: budgetsError } = await supabase
      .from("budget_tracking")
      .select(`
        id,
        trip_id,
        total_budget,
        total_spent,
        alert_threshold,
        trips!inner (
          id,
          title,
          user_id,
          status
        )
      `)
      .eq("trips.status", "active");

    if (budgetsError) {
      console.error("Error fetching budgets:", budgetsError);
    } else if (budgets) {
      for (const budget of budgets) {
        // Handle the joined trips data - it's an object, not array
        const tripData = budget.trips as unknown as { id: string; title: string; user_id: string; status: string } | null;
        if (!tripData || !budget.total_budget) continue;
        
        const spent = budget.total_spent || 0;
        const threshold = budget.alert_threshold || 0.8;
        const percentUsed = spent / budget.total_budget;

        if (percentUsed >= threshold && percentUsed < 1) {
          suggestions.push({
            userId: tripData.user_id,
            type: "budget_warning",
            title: `Budget alert for ${tripData.title}`,
            description: `You've spent ${Math.round(percentUsed * 100)}% of your budget. Consider reviewing your expenses.`,
            tripId: budget.trip_id,
            actionUrl: `/trips/${budget.trip_id}`,
            priority: 8,
          });
        } else if (percentUsed >= 1) {
          suggestions.push({
            userId: tripData.user_id,
            type: "budget_exceeded",
            title: `Budget exceeded for ${tripData.title}`,
            description: `You've exceeded your budget by ${Math.round((percentUsed - 1) * 100)}%. Time to adjust your plans!`,
            tripId: budget.trip_id,
            actionUrl: `/trips/${budget.trip_id}`,
            priority: 9,
          });
        }
      }
    }

    // ============================================
    // RULE 3: Upcoming Event Reminder
    // Remind about events happening in the next 24-48 hours
    // ============================================
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const { data: upcomingBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("id, user_id, resource_title, booking_type, start_date, start_time, trip_id")
      .eq("status", "confirmed")
      .gte("start_date", now.toISOString().split("T")[0])
      .lte("start_date", dayAfter.toISOString().split("T")[0]);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    } else if (upcomingBookings) {
      for (const booking of upcomingBookings) {
        const bookingDate = new Date(booking.start_date);
        const isToday = bookingDate.toDateString() === now.toDateString();
        const isTomorrow = bookingDate.toDateString() === tomorrow.toDateString();

        if (isToday || isTomorrow) {
          suggestions.push({
            userId: booking.user_id,
            type: "booking_reminder",
            title: `${isTomorrow ? "Tomorrow" : "Today"}: ${booking.resource_title}`,
            description: `Your ${booking.booking_type} booking is ${isTomorrow ? "tomorrow" : "today"}${booking.start_time ? ` at ${booking.start_time}` : ""}.`,
            tripId: booking.trip_id || undefined,
            actionUrl: `/bookings`,
            priority: isToday ? 10 : 6,
          });
        }
      }
    }

    // ============================================
    // RULE 4: Trip Starting Soon
    // Remind about trips starting in the next 3 days
    // ============================================
    const threeDaysOut = new Date(now);
    threeDaysOut.setDate(threeDaysOut.getDate() + 3);

    const { data: upcomingTrips, error: upcomingTripsError } = await supabase
      .from("trips")
      .select("id, title, user_id, start_date")
      .eq("status", "active")
      .is("deleted_at", null)
      .gte("start_date", now.toISOString().split("T")[0])
      .lte("start_date", threeDaysOut.toISOString().split("T")[0]);

    if (upcomingTripsError) {
      console.error("Error fetching upcoming trips:", upcomingTripsError);
    } else if (upcomingTrips) {
      for (const trip of upcomingTrips) {
        const tripDate = new Date(trip.start_date);
        const daysUntil = Math.ceil((tripDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil >= 0 && daysUntil <= 3) {
          const timeText = daysUntil === 0 ? "starts today" : daysUntil === 1 ? "starts tomorrow" : `starts in ${daysUntil} days`;
          suggestions.push({
            userId: trip.user_id,
            type: "trip_starting",
            title: `${trip.title} ${timeText}!`,
            description: `Get ready for your adventure. Review your itinerary and make sure everything is set.`,
            tripId: trip.id,
            actionUrl: `/trips/${trip.id}`,
            priority: daysUntil === 0 ? 10 : 8,
          });
        }
      }
    }

    // ============================================
    // Insert suggestions into proactive_suggestions
    // (Avoiding duplicates by checking existing)
    // ============================================
    let inserted = 0;
    let skipped = 0;

    for (const suggestion of suggestions) {
      // Check if similar suggestion exists (same type + trip/booking + user in last 24h)
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: existing } = await supabase
        .from("proactive_suggestions")
        .select("id")
        .eq("user_id", suggestion.userId)
        .eq("type", suggestion.type)
        .eq("trip_id", suggestion.tripId || null)
        .gte("created_at", yesterday.toISOString())
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      const { error: insertError } = await supabase
        .from("proactive_suggestions")
        .insert({
          user_id: suggestion.userId,
          type: suggestion.type,
          title: suggestion.title,
          description: suggestion.description,
          trip_id: suggestion.tripId || null,
          action_url: suggestion.actionUrl || null,
          priority: suggestion.priority || 5,
          agent_name: "rules-engine",
          status: "pending",
        });

      if (insertError) {
        console.error("Error inserting suggestion:", insertError);
      } else {
        inserted++;
      }
    }

    console.log(`Rules engine completed: ${inserted} inserted, ${skipped} skipped (duplicates)`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: suggestions.length,
        inserted,
        skipped,
        timestamp: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Rules engine error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
