import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export type NavThread = {
  id: string;
  title: string;
  updatedAt: string;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ threads: [] });
  }

  const service = createServiceRoleClient();
  if (!service) {
    console.error("[/api/threads] service role client unavailable");
    return NextResponse.json({ error: "Threads service unavailable" }, { status: 503 });
  }

  const { data, error } = await service
    .from("mastra_threads")
    .select('id, title, "updatedAt"')
    .eq("resourceId", user.id)
    .order('"updatedAt"', { ascending: false })
    .limit(20);

  if (error) {
    console.error("[/api/threads]", error.message);
    return NextResponse.json({ error: "Failed to load threads" }, { status: 500 });
  }

  const rows = (data ?? []) as Array<{ id: unknown; title: unknown; updatedAt: unknown }>;
  const threads: NavThread[] = rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    updatedAt: String(row.updatedAt),
  }));

  return NextResponse.json({ threads });
}
