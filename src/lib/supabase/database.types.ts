export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_runs: {
        Row: {
          agent_name: string
          agent_type: Database["public"]["Enums"]["agent_type"]
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          estimated_cost_usd: number | null
          id: string
          input_data: Json
          input_tokens: number | null
          metadata: Json | null
          model_name: string | null
          output_data: Json | null
          output_tokens: number | null
          status: Database["public"]["Enums"]["ai_run_status"] | null
          temperature: number | null
          total_tokens: number | null
          user_id: string | null
        }
        Insert: {
          agent_name: string
          agent_type: Database["public"]["Enums"]["agent_type"]
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          input_data: Json
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_data?: Json | null
          output_tokens?: number | null
          status?: Database["public"]["Enums"]["ai_run_status"] | null
          temperature?: number | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          agent_name?: string
          agent_type?: Database["public"]["Enums"]["agent_type"]
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          estimated_cost_usd?: number | null
          id?: string
          input_data?: Json
          input_tokens?: number | null
          metadata?: Json | null
          model_name?: string | null
          output_data?: Json | null
          output_tokens?: number | null
          status?: Database["public"]["Enums"]["ai_run_status"] | null
          temperature?: number | null
          total_tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events_daily: {
        Row: {
          affiliate_revenue_cents: number | null
          date: string
          landlord_id: string
          leads_received: number | null
          leads_viewed: number | null
          listings_created: number | null
          listings_edited: number | null
          logins: number | null
          replies_marked: number | null
          whatsapp_clicks: number | null
        }
        Insert: {
          affiliate_revenue_cents?: number | null
          date: string
          landlord_id: string
          leads_received?: number | null
          leads_viewed?: number | null
          listings_created?: number | null
          listings_edited?: number | null
          logins?: number | null
          replies_marked?: number | null
          whatsapp_clicks?: number | null
        }
        Update: {
          affiliate_revenue_cents?: number | null
          date?: string
          landlord_id?: string
          leads_received?: number | null
          leads_viewed?: number | null
          listings_created?: number | null
          listings_edited?: number | null
          logins?: number | null
          replies_marked?: number | null
          whatsapp_clicks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_daily_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_daily_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      apartments: {
        Row: {
          address: string | null
          amenities: string[] | null
          available_from: string | null
          available_to: string | null
          bathrooms: number | null
          bedrooms: number | null
          building_amenities: string[] | null
          city: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deposit_amount: number | null
          description: string | null
          featured: boolean | null
          floor_number: number | null
          freshness_status: string | null
          fts_content: unknown
          furnished: boolean | null
          host_id: string | null
          host_name: string | null
          host_response_time: string | null
          id: string
          images: string[] | null
          landlord_id: string | null
          last_checked_at: string | null
          latitude: number | null
          location: unknown
          longitude: number | null
          maximum_stay_days: number | null
          metadata: Json | null
          minimum_stay_days: number | null
          moderation_status: string
          neighborhood: string
          parking_included: boolean | null
          pet_friendly: boolean | null
          price_daily: number | null
          price_monthly: number | null
          price_weekly: number | null
          rating: number | null
          raw_amenities: Json | null
          rejection_reason: string | null
          review_count: number | null
          size_sqm: number | null
          slug: string | null
          smoking_allowed: boolean | null
          source: string | null
          source_listing_id: string | null
          source_url: string | null
          status: string | null
          title: string
          total_floors: number | null
          updated_at: string
          utilities_included: boolean | null
          verified: boolean | null
          video_url: string | null
          virtual_tour_url: string | null
          wifi_speed: number | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          available_from?: string | null
          available_to?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_amenities?: string[] | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deposit_amount?: number | null
          description?: string | null
          featured?: boolean | null
          floor_number?: number | null
          freshness_status?: string | null
          fts_content?: unknown
          furnished?: boolean | null
          host_id?: string | null
          host_name?: string | null
          host_response_time?: string | null
          id?: string
          images?: string[] | null
          landlord_id?: string | null
          last_checked_at?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          maximum_stay_days?: number | null
          metadata?: Json | null
          minimum_stay_days?: number | null
          moderation_status?: string
          neighborhood: string
          parking_included?: boolean | null
          pet_friendly?: boolean | null
          price_daily?: number | null
          price_monthly?: number | null
          price_weekly?: number | null
          rating?: number | null
          raw_amenities?: Json | null
          rejection_reason?: string | null
          review_count?: number | null
          size_sqm?: number | null
          slug?: string | null
          smoking_allowed?: boolean | null
          source?: string | null
          source_listing_id?: string | null
          source_url?: string | null
          status?: string | null
          title: string
          total_floors?: number | null
          updated_at?: string
          utilities_included?: boolean | null
          verified?: boolean | null
          video_url?: string | null
          virtual_tour_url?: string | null
          wifi_speed?: number | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          available_from?: string | null
          available_to?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_amenities?: string[] | null
          city?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deposit_amount?: number | null
          description?: string | null
          featured?: boolean | null
          floor_number?: number | null
          freshness_status?: string | null
          fts_content?: unknown
          furnished?: boolean | null
          host_id?: string | null
          host_name?: string | null
          host_response_time?: string | null
          id?: string
          images?: string[] | null
          landlord_id?: string | null
          last_checked_at?: string | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          maximum_stay_days?: number | null
          metadata?: Json | null
          minimum_stay_days?: number | null
          moderation_status?: string
          neighborhood?: string
          parking_included?: boolean | null
          pet_friendly?: boolean | null
          price_daily?: number | null
          price_monthly?: number | null
          price_weekly?: number | null
          rating?: number | null
          raw_amenities?: Json | null
          rejection_reason?: string | null
          review_count?: number | null
          size_sqm?: number | null
          slug?: string | null
          smoking_allowed?: boolean | null
          source?: string | null
          source_listing_id?: string | null
          source_url?: string | null
          status?: string | null
          title?: string
          total_floors?: number | null
          updated_at?: string
          utilities_included?: boolean | null
          verified?: boolean | null
          video_url?: string | null
          virtual_tour_url?: string | null
          wifi_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "apartments_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apartments_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_decisions: {
        Row: {
          created_at: string
          decided_by: string
          decision: string
          id: string
          reason: string | null
          request_id: string
        }
        Insert: {
          created_at?: string
          decided_by: string
          decision: string
          id?: string
          reason?: string | null
          request_id: string
        }
        Update: {
          created_at?: string
          decided_by?: string
          decision?: string
          id?: string
          reason?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_decisions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          action_type: string
          agent: string
          decided_at: string | null
          decided_by: string | null
          expires_at: string
          id: string
          notes: string | null
          outbox_id: string | null
          payload: Json
          requested_at: string
          requested_by: string
          risk_level: string
          status: string
          subject: string
        }
        Insert: {
          action_type: string
          agent: string
          decided_at?: string | null
          decided_by?: string | null
          expires_at?: string
          id?: string
          notes?: string | null
          outbox_id?: string | null
          payload: Json
          requested_at?: string
          requested_by: string
          risk_level?: string
          status?: string
          subject: string
        }
        Update: {
          action_type?: string
          agent?: string
          decided_at?: string | null
          decided_by?: string | null
          expires_at?: string
          id?: string
          notes?: string | null
          outbox_id?: string | null
          payload?: Json
          requested_at?: string
          requested_by?: string
          risk_level?: string
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_outbox_id_fkey"
            columns: ["outbox_id"]
            isOneToOne: false
            referencedRelation: "outbox"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          cancelled_at: string | null
          confirmation_code: string | null
          confirmed_at: string | null
          created_at: string
          currency: string | null
          end_date: string | null
          end_time: string | null
          id: string
          metadata: Json | null
          notes: string | null
          partner_id: string | null
          partner_notes: string | null
          partner_status: string
          party_size: number | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          quantity: number | null
          resource_id: string
          resource_title: string
          special_requests: string | null
          start_date: string
          start_time: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          trip_id: string | null
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          booking_type: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          confirmation_code?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          partner_id?: string | null
          partner_notes?: string | null
          partner_status?: string
          party_size?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          quantity?: number | null
          resource_id: string
          resource_title: string
          special_requests?: string | null
          start_date: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          trip_id?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          booking_type?: Database["public"]["Enums"]["booking_type"]
          cancelled_at?: string | null
          confirmation_code?: string | null
          confirmed_at?: string | null
          created_at?: string
          currency?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          partner_id?: string | null
          partner_notes?: string | null
          partner_status?: string
          party_size?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          quantity?: number | null
          resource_id?: string
          resource_title?: string
          special_requests?: string | null
          start_date?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          trip_id?: string | null
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_tracking: {
        Row: {
          ai_recommendations: Json | null
          alert_threshold: number | null
          alerts_sent: Json | null
          categories: Json | null
          created_at: string
          currency: string | null
          id: string
          last_optimization_at: string | null
          total_budget: number
          total_pending: number | null
          total_spent: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          ai_recommendations?: Json | null
          alert_threshold?: number | null
          alerts_sent?: Json | null
          categories?: Json | null
          created_at?: string
          currency?: string | null
          id?: string
          last_optimization_at?: string | null
          total_budget: number
          total_pending?: number | null
          total_spent?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          ai_recommendations?: Json | null
          alert_threshold?: number | null
          alerts_sent?: Json | null
          categories?: Json | null
          created_at?: string
          currency?: string | null
          id?: string
          last_optimization_at?: string | null
          total_budget?: number
          total_pending?: number | null
          total_spent?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_tracking_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          color: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          emoji: string | null
          id: string
          is_public: boolean | null
          item_count: number | null
          name: string
          share_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_public?: boolean | null
          item_count?: number | null
          name: string
          share_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_public?: boolean | null
          item_count?: number | null
          name?: string
          share_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conflict_resolutions: {
        Row: {
          affected_items: Json
          created_at: string
          description: string
          detected_at: string
          id: string
          metadata: Json | null
          resolution_options: Json | null
          resolved_at: string | null
          resolved_by: string | null
          selected_resolution: Json | null
          severity: number
          status: Database["public"]["Enums"]["resolution_status"] | null
          title: string
          trip_id: string
          type: Database["public"]["Enums"]["conflict_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          affected_items?: Json
          created_at?: string
          description: string
          detected_at?: string
          id?: string
          metadata?: Json | null
          resolution_options?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          selected_resolution?: Json | null
          severity: number
          status?: Database["public"]["Enums"]["resolution_status"] | null
          title: string
          trip_id: string
          type: Database["public"]["Enums"]["conflict_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          affected_items?: Json
          created_at?: string
          description?: string
          detected_at?: string
          id?: string
          metadata?: Json | null
          resolution_options?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          selected_resolution?: Json | null
          severity?: number
          status?: Database["public"]["Enums"]["resolution_status"] | null
          title?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["conflict_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conflict_resolutions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conflict_resolutions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_receipts: {
        Row: {
          external_id: string
          id: string
          outbox_id: string
          outbox_table: string
          provider: string
          raw: Json | null
          received_at: string
          status: string
        }
        Insert: {
          external_id: string
          id?: string
          outbox_id: string
          outbox_table: string
          provider: string
          raw?: Json | null
          received_at?: string
          status: string
        }
        Update: {
          external_id?: string
          id?: string
          outbox_id?: string
          outbox_table?: string
          provider?: string
          raw?: Json | null
          received_at?: string
          status?: string
        }
        Relationships: []
      }
      email_outbox: {
        Row: {
          agent_run_id: string | null
          approval_id: string | null
          attempts: number
          campaign_id: string | null
          channel: string
          created_at: string
          external_id: string | null
          id: string
          last_error: string | null
          next_attempt_at: string
          payload: Json
          post_id: string | null
          provider: string
          sent_at: string | null
          status: string
          to_email: string
        }
        Insert: {
          agent_run_id?: string | null
          approval_id?: string | null
          attempts?: number
          campaign_id?: string | null
          channel?: string
          created_at?: string
          external_id?: string | null
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          payload?: Json
          post_id?: string | null
          provider?: string
          sent_at?: string | null
          status?: string
          to_email: string
        }
        Update: {
          agent_run_id?: string | null
          approval_id?: string | null
          attempts?: number
          campaign_id?: string | null
          channel?: string
          created_at?: string
          external_id?: string | null
          id?: string
          last_error?: string | null
          next_attempt_at?: string
          payload?: Json
          post_id?: string | null
          provider?: string
          sent_at?: string | null
          status?: string
          to_email?: string
        }
        Relationships: []
      }
      embedding_jobs: {
        Row: {
          attempts: number
          content_hash: string
          created_at: string
          dimensions: number
          entity_id: string
          entity_type: string
          id: string
          last_error: string | null
          model: string
          processed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          content_hash: string
          created_at?: string
          dimensions?: number
          entity_id: string
          entity_type: string
          id?: string
          last_error?: string | null
          model?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          content_hash?: string
          created_at?: string
          dimensions?: number
          entity_id?: string
          entity_type?: string
          id?: string
          last_error?: string | null
          model?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_attendee_profiles: {
        Row: {
          accessibility_detail: string | null
          accessibility_needs: string[] | null
          attendee_id: string
          company: string | null
          custom_fields: Json | null
          dietary_detail: string | null
          dietary_preference: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          job_title: string | null
          marketing_consent: boolean
          shirt_size: string | null
          updated_at: string
        }
        Insert: {
          accessibility_detail?: string | null
          accessibility_needs?: string[] | null
          attendee_id: string
          company?: string | null
          custom_fields?: Json | null
          dietary_detail?: string | null
          dietary_preference?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          job_title?: string | null
          marketing_consent?: boolean
          shirt_size?: string | null
          updated_at?: string
        }
        Update: {
          accessibility_detail?: string | null
          accessibility_needs?: string[] | null
          attendee_id?: string
          company?: string | null
          custom_fields?: Json | null
          dietary_detail?: string | null
          dietary_preference?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          job_title?: string | null
          marketing_consent?: boolean
          shirt_size?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendee_profiles_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: true
            referencedRelation: "event_attendees"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendees: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          order_id: string
          phone_e164: string | null
          qr_token: string
          qr_used_at: string | null
          status: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id: string
          order_id: string
          phone_e164?: string | null
          qr_token: string
          qr_used_at?: string | null
          status?: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          order_id?: string
          phone_e164?: string | null
          qr_token?: string
          qr_used_at?: string | null
          status?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "event_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_check_ins: {
        Row: {
          attendee_id: string | null
          created_at: string
          details: Json | null
          event_id: string
          id: string
          ip_address: unknown
          qr_token: string
          result: string
          scanned_by: string | null
          scanner_device: string | null
        }
        Insert: {
          attendee_id?: string | null
          created_at?: string
          details?: Json | null
          event_id: string
          id?: string
          ip_address?: unknown
          qr_token: string
          result: string
          scanned_by?: string | null
          scanner_device?: string | null
        }
        Update: {
          attendee_id?: string | null
          created_at?: string
          details?: Json | null
          event_id?: string
          id?: string
          ip_address?: unknown
          qr_token?: string
          result?: string
          scanned_by?: string | null
          scanner_device?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_check_ins_attendee_id_fkey"
            columns: ["attendee_id"]
            isOneToOne: false
            referencedRelation: "event_attendees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_embeddings: {
        Row: {
          content_hash: string | null
          embedding: string
          event_id: string
          id: string
          model: string
          updated_at: string | null
        }
        Insert: {
          content_hash?: string | null
          embedding: string
          event_id: string
          id?: string
          model?: string
          updated_at?: string | null
        }
        Update: {
          content_hash?: string | null
          embedding?: string
          event_id?: string
          id?: string
          model?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_embeddings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_grounding: {
        Row: {
          checked_at: string | null
          claim: string
          confidence: number | null
          event_id: string
          id: string
          source_type: string
          source_url: string | null
        }
        Insert: {
          checked_at?: string | null
          claim: string
          confidence?: number | null
          event_id: string
          id?: string
          source_type: string
          source_url?: string | null
        }
        Update: {
          checked_at?: string | null
          claim?: string
          confidence?: number | null
          event_id?: string
          id?: string
          source_type?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_grounding_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_media_assets: {
        Row: {
          alt_text: string | null
          asset_type: string
          caption: string | null
          copyright_owner: string | null
          created_at: string
          display_order: number
          event_id: string
          filename: string
          id: string
          is_public: boolean
          metadata: Json | null
          mime_type: string
          public_url: string | null
          size_bytes: number
          sponsor_id: string | null
          storage_bucket: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          asset_type: string
          caption?: string | null
          copyright_owner?: string | null
          created_at?: string
          display_order?: number
          event_id: string
          filename: string
          id?: string
          is_public?: boolean
          metadata?: Json | null
          mime_type: string
          public_url?: string | null
          size_bytes: number
          sponsor_id?: string | null
          storage_bucket: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string
          caption?: string | null
          copyright_owner?: string | null
          created_at?: string
          display_order?: number
          event_id?: string
          filename?: string
          id?: string
          is_public?: boolean
          metadata?: Json | null
          mime_type?: string
          public_url?: string | null
          size_bytes?: number
          sponsor_id?: string | null
          storage_bucket?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_media_assets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_order_refunds: {
        Row: {
          amount_cents: number
          attendee_ids: string[] | null
          completed_at: string | null
          created_at: string
          currency: string
          id: string
          initiated_by: string | null
          initiated_via: string
          order_id: string
          reason: string | null
          reason_detail: string | null
          status: string
          stripe_refund_id: string | null
        }
        Insert: {
          amount_cents: number
          attendee_ids?: string[] | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          initiated_by?: string | null
          initiated_via: string
          order_id: string
          reason?: string | null
          reason_detail?: string | null
          status?: string
          stripe_refund_id?: string | null
        }
        Update: {
          amount_cents?: number
          attendee_ids?: string[] | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          id?: string
          initiated_by?: string | null
          initiated_via?: string
          order_id?: string
          reason?: string | null
          reason_detail?: string | null
          status?: string
          stripe_refund_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "event_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      event_orders: {
        Row: {
          access_token: string
          buyer_anon_id: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone_e164: string | null
          buyer_user_id: string | null
          created_at: string
          currency: string
          discount_cents: number
          event_id: string
          fee_cents: number
          id: string
          payment_id: string | null
          promo_code_id: string | null
          quantity: number
          short_id: string
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          subtotal_cents: number
          tax_cents: number
          ticket_id: string
          total_cents: number
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          buyer_anon_id?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone_e164?: string | null
          buyer_user_id?: string | null
          created_at?: string
          currency?: string
          discount_cents?: number
          event_id: string
          fee_cents?: number
          id?: string
          payment_id?: string | null
          promo_code_id?: string | null
          quantity: number
          short_id: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal_cents?: number
          tax_cents?: number
          ticket_id: string
          total_cents: number
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          buyer_anon_id?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone_e164?: string | null
          buyer_user_id?: string | null
          created_at?: string
          currency?: string
          discount_cents?: number
          event_id?: string
          fee_cents?: number
          id?: string
          payment_id?: string | null
          promo_code_id?: string | null
          quantity?: number
          short_id?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          subtotal_cents?: number
          tax_cents?: number
          ticket_id?: string
          total_cents?: number
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "event_promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_orders_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_orders_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      event_promo_codes: {
        Row: {
          applicable_ticket_ids: string[] | null
          code: string
          created_at: string
          created_by: string | null
          discount_type: string
          discount_value: number
          event_id: string
          expires_at: string | null
          id: string
          max_usages: number | null
          starts_at: string | null
          unlocks_hidden_tickets: boolean
          updated_at: string
          usage_count: number
        }
        Insert: {
          applicable_ticket_ids?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          discount_type: string
          discount_value: number
          event_id: string
          expires_at?: string | null
          id?: string
          max_usages?: number | null
          starts_at?: string | null
          unlocks_hidden_tickets?: boolean
          updated_at?: string
          usage_count?: number
        }
        Update: {
          applicable_ticket_ids?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          event_id?: string
          expires_at?: string | null
          id?: string
          max_usages?: number | null
          starts_at?: string | null
          unlocks_hidden_tickets?: boolean
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_promo_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_signals: {
        Row: {
          confidence: number
          event_id: string
          evidence: Json
          exclusivity: number | null
          fashion_score: number | null
          generated_at: string
          hype_score: number | null
          local_vs_tourist: number | null
          model_version: string | null
          music_energy: number | null
          networking_quality: number | null
          nightlife_score: number | null
          safety_score: number | null
          source: string
          updated_at: string
        }
        Insert: {
          confidence?: number
          event_id: string
          evidence?: Json
          exclusivity?: number | null
          fashion_score?: number | null
          generated_at?: string
          hype_score?: number | null
          local_vs_tourist?: number | null
          model_version?: string | null
          music_energy?: number | null
          networking_quality?: number | null
          nightlife_score?: number | null
          safety_score?: number | null
          source?: string
          updated_at?: string
        }
        Update: {
          confidence?: number
          event_id?: string
          evidence?: Json
          exclusivity?: number | null
          fashion_score?: number | null
          generated_at?: string
          hype_score?: number | null
          local_vs_tourist?: number | null
          model_version?: string | null
          music_energy?: number | null
          networking_quality?: number | null
          nightlife_score?: number | null
          safety_score?: number | null
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_signals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsor_placements: {
        Row: {
          asset_id: string | null
          created_at: string
          ends_at: string | null
          event_sponsor_id: string
          id: string
          is_active: boolean
          position: number
          starts_at: string | null
          surface: string
          updated_at: string
          weight: number
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          ends_at?: string | null
          event_sponsor_id: string
          id?: string
          is_active?: boolean
          position?: number
          starts_at?: string | null
          surface: string
          updated_at?: string
          weight?: number
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          ends_at?: string | null
          event_sponsor_id?: string
          id?: string
          is_active?: boolean
          position?: number
          starts_at?: string | null
          surface?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsor_placements_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "event_media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsor_placements_event_sponsor_id_fkey"
            columns: ["event_sponsor_id"]
            isOneToOne: false
            referencedRelation: "event_sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          amount_cents: number
          approved_at: string | null
          approved_by: string | null
          contract_end_at: string | null
          contract_start_at: string | null
          created_at: string
          currency: string
          event_id: string
          id: string
          sponsor_org_id: string
          status: string
          tier: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          approved_at?: string | null
          approved_by?: string | null
          contract_end_at?: string | null
          contract_start_at?: string | null
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          sponsor_org_id: string
          status?: string
          tier: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          approved_at?: string | null
          approved_by?: string | null
          contract_end_at?: string | null
          contract_start_at?: string | null
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          sponsor_org_id?: string
          status?: string
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_stakeholders: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          invited_at: string
          invited_by: string | null
          is_primary: boolean
          notes: string | null
          organization: string | null
          phone_e164: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_primary?: boolean
          notes?: string | null
          organization?: string | null
          phone_e164?: string | null
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_primary?: boolean
          notes?: string | null
          organization?: string | null
          phone_e164?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_stakeholders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_taxes_and_fees: {
        Row: {
          calculation_type: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          organizer_id: string
          rate: number
          type: string
          updated_at: string
        }
        Insert: {
          calculation_type: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          organizer_id: string
          rate: number
          type: string
          updated_at?: string
        }
        Update: {
          calculation_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          organizer_id?: string
          rate?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_taxes_and_fees_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_ticket_taxes_and_fees: {
        Row: {
          tax_fee_id: string
          ticket_id: string
        }
        Insert: {
          tax_fee_id: string
          ticket_id: string
        }
        Update: {
          tax_fee_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_ticket_taxes_and_fees_tax_fee_id_fkey"
            columns: ["tax_fee_id"]
            isOneToOne: false
            referencedRelation: "event_taxes_and_fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_ticket_taxes_and_fees_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tickets: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          event_id: string
          id: string
          is_active: boolean
          is_hidden: boolean
          max_per_order: number
          min_per_order: number
          name: string
          position: number
          price_cents: number
          qty_pending: number
          qty_sold: number
          qty_total: number
          sale_ends_at: string | null
          sale_starts_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          event_id: string
          id?: string
          is_active?: boolean
          is_hidden?: boolean
          max_per_order?: number
          min_per_order?: number
          name: string
          position?: number
          price_cents: number
          qty_pending?: number
          qty_sold?: number
          qty_total: number
          sale_ends_at?: string | null
          sale_starts_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          event_id?: string
          id?: string
          is_active?: boolean
          is_hidden?: boolean
          max_per_order?: number
          min_per_order?: number
          name?: string
          position?: number
          price_cents?: number
          qty_pending?: number
          qty_sold?: number
          qty_total?: number
          sale_ends_at?: string | null
          sale_starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_vendors: {
        Row: {
          amount_paid_cents: number
          booked_at: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone_e164: string | null
          contract_amount_cents: number | null
          contract_url: string | null
          created_at: string
          currency: string
          event_id: string
          id: string
          invoice_url: string | null
          notes: string | null
          payment_status: string
          service_date: string | null
          service_type: string
          updated_at: string
        }
        Insert: {
          amount_paid_cents?: number
          booked_at?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone_e164?: string | null
          contract_amount_cents?: number | null
          contract_url?: string | null
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          payment_status?: string
          service_date?: string | null
          service_type: string
          updated_at?: string
        }
        Update: {
          amount_paid_cents?: number
          booked_at?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone_e164?: string | null
          contract_amount_cents?: number | null
          contract_url?: string | null
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          payment_status?: string
          service_date?: string | null
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_venues: {
        Row: {
          address: string
          capacity: number | null
          city: string
          country: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          organizer_id: string
          postal_code: string | null
          updated_at: string
        }
        Insert: {
          address: string
          capacity?: number | null
          city: string
          country?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          organizer_id: string
          postal_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          capacity?: number | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          organizer_id?: string
          postal_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_venues_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_wait_list: {
        Row: {
          claimed_at: string | null
          created_at: string
          email: string
          event_id: string
          hold_expires_at: string | null
          id: string
          notified_at: string | null
          phone: string | null
          position: number
          status: string
          ticket_type_id: string
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string
          email: string
          event_id: string
          hold_expires_at?: string | null
          id?: string
          notified_at?: string | null
          phone?: string | null
          position: number
          status?: string
          ticket_type_id: string
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string
          email?: string
          event_id?: string
          hold_expires_at?: string | null
          id?: string
          notified_at?: string | null
          phone?: string | null
          position?: number
          status?: string
          ticket_type_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_wait_list_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_wait_list_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "event_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          ai_summary: string | null
          cache_expires_at: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          data_freshness: string | null
          description: string | null
          details: Json | null
          email: string | null
          event_end_time: string | null
          event_start_time: string
          event_type: string | null
          external_id: string | null
          fts_content: unknown
          google_place_id: string | null
          id: string
          images: Json | null
          is_active: boolean
          is_verified: boolean
          latitude: number | null
          longitude: number | null
          maps_url: string | null
          name: string
          organizer_id: string | null
          phone: string | null
          postal_code: string | null
          primary_image_url: string | null
          rating: number | null
          rating_count: number | null
          slug: string | null
          source: string
          staff_link_version: number
          state: string | null
          status: string
          subcategory: string | null
          tags: string[] | null
          ticket_price_max: number | null
          ticket_price_min: number | null
          ticket_url: string | null
          ticketmaster_id: string | null
          timezone: string | null
          total_capacity: number | null
          updated_at: string
          venue_id: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          ai_summary?: string | null
          cache_expires_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          data_freshness?: string | null
          description?: string | null
          details?: Json | null
          email?: string | null
          event_end_time?: string | null
          event_start_time: string
          event_type?: string | null
          external_id?: string | null
          fts_content?: unknown
          google_place_id?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name: string
          organizer_id?: string | null
          phone?: string | null
          postal_code?: string | null
          primary_image_url?: string | null
          rating?: number | null
          rating_count?: number | null
          slug?: string | null
          source?: string
          staff_link_version?: number
          state?: string | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          ticket_price_max?: number | null
          ticket_price_min?: number | null
          ticket_url?: string | null
          ticketmaster_id?: string | null
          timezone?: string | null
          total_capacity?: number | null
          updated_at?: string
          venue_id?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          ai_summary?: string | null
          cache_expires_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          data_freshness?: string | null
          description?: string | null
          details?: Json | null
          email?: string | null
          event_end_time?: string | null
          event_start_time?: string
          event_type?: string | null
          external_id?: string | null
          fts_content?: unknown
          google_place_id?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name?: string
          organizer_id?: string | null
          phone?: string | null
          postal_code?: string | null
          primary_image_url?: string | null
          rating?: number | null
          rating_count?: number | null
          slug?: string | null
          source?: string
          staff_link_version?: number
          state?: string | null
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          ticket_price_max?: number | null
          ticket_price_min?: number | null
          ticket_url?: string | null
          ticketmaster_id?: string | null
          timezone?: string | null
          total_capacity?: number | null
          updated_at?: string
          venue_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "event_venues"
            referencedColumns: ["id"]
          },
        ]
      }
      grounding_failures: {
        Row: {
          created_at: string
          failure_reason: string
          id: string
          latency_ms: number | null
          query_text: string
          slots: Json
          tool_name: string
        }
        Insert: {
          created_at?: string
          failure_reason: string
          id?: string
          latency_ms?: number | null
          query_text: string
          slots?: Json
          tool_name: string
        }
        Update: {
          created_at?: string
          failure_reason?: string
          id?: string
          latency_ms?: number | null
          query_text?: string
          slots?: Json
          tool_name?: string
        }
        Relationships: []
      }
      grounding_quota_log: {
        Row: {
          count: number
          date: string
        }
        Insert: {
          count?: number
          date?: string
        }
        Update: {
          count?: number
          date?: string
        }
        Relationships: []
      }
      idempotency_keys: {
        Row: {
          created_at: string
          endpoint: string
          key: string
          response: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          key: string
          response: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          key?: string
          response?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      landlord_inbox: {
        Row: {
          apartment_id: string | null
          archived_at: string | null
          archived_reason: string | null
          channel: string
          conversation_id: string | null
          created_at: string
          first_reply_at: string | null
          id: string
          landlord_id: string | null
          raw_message: string
          renter_email: string | null
          renter_id: string | null
          renter_name: string | null
          renter_phone_e164: string | null
          status: string
          structured_profile: Json | null
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          apartment_id?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          channel?: string
          conversation_id?: string | null
          created_at?: string
          first_reply_at?: string | null
          id?: string
          landlord_id?: string | null
          raw_message: string
          renter_email?: string | null
          renter_id?: string | null
          renter_name?: string | null
          renter_phone_e164?: string | null
          status?: string
          structured_profile?: Json | null
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          apartment_id?: string | null
          archived_at?: string | null
          archived_reason?: string | null
          channel?: string
          conversation_id?: string | null
          created_at?: string
          first_reply_at?: string | null
          id?: string
          landlord_id?: string | null
          raw_message?: string
          renter_email?: string | null
          renter_id?: string | null
          renter_name?: string | null
          renter_phone_e164?: string | null
          status?: string
          structured_profile?: Json | null
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_inbox_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landlord_inbox_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landlord_inbox_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      landlord_inbox_events: {
        Row: {
          actor_kind: string | null
          actor_user_id: string | null
          created_at: string
          event_type: string
          id: string
          inbox_id: string
          metadata: Json | null
        }
        Insert: {
          actor_kind?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          inbox_id: string
          metadata?: Json | null
        }
        Update: {
          actor_kind?: string | null
          actor_user_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          inbox_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_inbox_events_inbox_id_fkey"
            columns: ["inbox_id"]
            isOneToOne: false
            referencedRelation: "landlord_inbox"
            referencedColumns: ["id"]
          },
        ]
      }
      landlord_profiles: {
        Row: {
          active_listings: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          kind: string
          languages: string[] | null
          median_response_time_minutes: number | null
          notes: string | null
          phone_e164: string | null
          primary_neighborhood: string | null
          source: string | null
          total_leads_received: number | null
          total_listings: number | null
          total_replies_sent: number | null
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          whatsapp_e164: string | null
        }
        Insert: {
          active_listings?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          kind?: string
          languages?: string[] | null
          median_response_time_minutes?: number | null
          notes?: string | null
          phone_e164?: string | null
          primary_neighborhood?: string | null
          source?: string | null
          total_leads_received?: number | null
          total_listings?: number | null
          total_replies_sent?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          whatsapp_e164?: string | null
        }
        Update: {
          active_listings?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          kind?: string
          languages?: string[] | null
          median_response_time_minutes?: number | null
          notes?: string | null
          phone_e164?: string | null
          primary_neighborhood?: string | null
          source?: string | null
          total_leads_received?: number | null
          total_listings?: number | null
          total_replies_sent?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          whatsapp_e164?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          apartment_id: string | null
          assigned_agent_id: string | null
          budget_max: number | null
          budget_min: number | null
          conversion_probability: number | null
          created_at: string
          email: string | null
          hot_lead_alerted: boolean | null
          id: string
          idempotency_key: string | null
          intent: string | null
          last_contacted_at: string | null
          listing_id: string | null
          listing_kind: string | null
          metadata: Json
          name: string | null
          neighborhood_id: string | null
          next_followup_at: string | null
          notes: string | null
          partner_id: string | null
          phone: string | null
          pipeline_stage: string | null
          preferred_showing_at: string | null
          score: number | null
          score_breakdown: Json | null
          source: string
          status: string
          trip_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          apartment_id?: string | null
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          conversion_probability?: number | null
          created_at?: string
          email?: string | null
          hot_lead_alerted?: boolean | null
          id?: string
          idempotency_key?: string | null
          intent?: string | null
          last_contacted_at?: string | null
          listing_id?: string | null
          listing_kind?: string | null
          metadata?: Json
          name?: string | null
          neighborhood_id?: string | null
          next_followup_at?: string | null
          notes?: string | null
          partner_id?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_showing_at?: string | null
          score?: number | null
          score_breakdown?: Json | null
          source?: string
          status?: string
          trip_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          apartment_id?: string | null
          assigned_agent_id?: string | null
          budget_max?: number | null
          budget_min?: number | null
          conversion_probability?: number | null
          created_at?: string
          email?: string | null
          hot_lead_alerted?: boolean | null
          id?: string
          idempotency_key?: string | null
          intent?: string | null
          last_contacted_at?: string | null
          listing_id?: string | null
          listing_kind?: string | null
          metadata?: Json
          name?: string | null
          neighborhood_id?: string | null
          next_followup_at?: string | null
          notes?: string | null
          partner_id?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          preferred_showing_at?: string | null
          score?: number | null
          score_breakdown?: Json | null
          source?: string
          status?: string
          trip_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_embeddings: {
        Row: {
          content_hash: string | null
          embedding: string
          id: string
          listing_id: string
          model: string
          updated_at: string | null
        }
        Insert: {
          content_hash?: string | null
          embedding: string
          id?: string
          listing_id: string
          model?: string
          updated_at?: string | null
        }
        Update: {
          content_hash?: string | null
          embedding?: string
          id?: string
          listing_id?: string
          model?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_embeddings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      mastra_agent_versions: {
        Row: {
          agentId: string
          agents: Json | null
          changedFields: Json | null
          changeMessage: string | null
          createdAt: string
          createdAtZ: string | null
          defaultOptions: Json | null
          description: string | null
          id: string
          inputProcessors: Json | null
          instructions: string
          integrationTools: Json | null
          mcpClients: Json | null
          memory: Json | null
          model: Json
          name: string
          outputProcessors: Json | null
          requestContextSchema: Json | null
          scorers: Json | null
          skills: Json | null
          skillsFormat: string | null
          tools: Json | null
          versionNumber: number
          workflows: Json | null
          workspace: Json | null
        }
        Insert: {
          agentId: string
          agents?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt: string
          createdAtZ?: string | null
          defaultOptions?: Json | null
          description?: string | null
          id: string
          inputProcessors?: Json | null
          instructions: string
          integrationTools?: Json | null
          mcpClients?: Json | null
          memory?: Json | null
          model: Json
          name: string
          outputProcessors?: Json | null
          requestContextSchema?: Json | null
          scorers?: Json | null
          skills?: Json | null
          skillsFormat?: string | null
          tools?: Json | null
          versionNumber: number
          workflows?: Json | null
          workspace?: Json | null
        }
        Update: {
          agentId?: string
          agents?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt?: string
          createdAtZ?: string | null
          defaultOptions?: Json | null
          description?: string | null
          id?: string
          inputProcessors?: Json | null
          instructions?: string
          integrationTools?: Json | null
          mcpClients?: Json | null
          memory?: Json | null
          model?: Json
          name?: string
          outputProcessors?: Json | null
          requestContextSchema?: Json | null
          scorers?: Json | null
          skills?: Json | null
          skillsFormat?: string | null
          tools?: Json | null
          versionNumber?: number
          workflows?: Json | null
          workspace?: Json | null
        }
        Relationships: []
      }
      mastra_agents: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_ai_spans: {
        Row: {
          attributes: Json | null
          createdAt: string
          createdAtZ: string | null
          endedAt: string | null
          endedAtZ: string | null
          entityId: string | null
          entityName: string | null
          entityType: string | null
          entityVersionId: string | null
          environment: string | null
          error: Json | null
          experimentId: string | null
          input: Json | null
          isEvent: boolean
          links: Json | null
          metadata: Json | null
          name: string
          organizationId: string | null
          output: Json | null
          parentEntityId: string | null
          parentEntityName: string | null
          parentEntityType: string | null
          parentEntityVersionId: string | null
          parentSpanId: string | null
          requestContext: Json | null
          requestId: string | null
          resourceId: string | null
          rootEntityId: string | null
          rootEntityName: string | null
          rootEntityType: string | null
          rootEntityVersionId: string | null
          runId: string | null
          scope: Json | null
          serviceName: string | null
          sessionId: string | null
          source: string | null
          spanId: string
          spanType: string
          startedAt: string
          startedAtZ: string | null
          tags: Json | null
          threadId: string | null
          traceId: string
          updatedAt: string | null
          updatedAtZ: string | null
          userId: string | null
        }
        Insert: {
          attributes?: Json | null
          createdAt: string
          createdAtZ?: string | null
          endedAt?: string | null
          endedAtZ?: string | null
          entityId?: string | null
          entityName?: string | null
          entityType?: string | null
          entityVersionId?: string | null
          environment?: string | null
          error?: Json | null
          experimentId?: string | null
          input?: Json | null
          isEvent: boolean
          links?: Json | null
          metadata?: Json | null
          name: string
          organizationId?: string | null
          output?: Json | null
          parentEntityId?: string | null
          parentEntityName?: string | null
          parentEntityType?: string | null
          parentEntityVersionId?: string | null
          parentSpanId?: string | null
          requestContext?: Json | null
          requestId?: string | null
          resourceId?: string | null
          rootEntityId?: string | null
          rootEntityName?: string | null
          rootEntityType?: string | null
          rootEntityVersionId?: string | null
          runId?: string | null
          scope?: Json | null
          serviceName?: string | null
          sessionId?: string | null
          source?: string | null
          spanId: string
          spanType: string
          startedAt: string
          startedAtZ?: string | null
          tags?: Json | null
          threadId?: string | null
          traceId: string
          updatedAt?: string | null
          updatedAtZ?: string | null
          userId?: string | null
        }
        Update: {
          attributes?: Json | null
          createdAt?: string
          createdAtZ?: string | null
          endedAt?: string | null
          endedAtZ?: string | null
          entityId?: string | null
          entityName?: string | null
          entityType?: string | null
          entityVersionId?: string | null
          environment?: string | null
          error?: Json | null
          experimentId?: string | null
          input?: Json | null
          isEvent?: boolean
          links?: Json | null
          metadata?: Json | null
          name?: string
          organizationId?: string | null
          output?: Json | null
          parentEntityId?: string | null
          parentEntityName?: string | null
          parentEntityType?: string | null
          parentEntityVersionId?: string | null
          parentSpanId?: string | null
          requestContext?: Json | null
          requestId?: string | null
          resourceId?: string | null
          rootEntityId?: string | null
          rootEntityName?: string | null
          rootEntityType?: string | null
          rootEntityVersionId?: string | null
          runId?: string | null
          scope?: Json | null
          serviceName?: string | null
          sessionId?: string | null
          source?: string | null
          spanId?: string
          spanType?: string
          startedAt?: string
          startedAtZ?: string | null
          tags?: Json | null
          threadId?: string | null
          traceId?: string
          updatedAt?: string | null
          updatedAtZ?: string | null
          userId?: string | null
        }
        Relationships: []
      }
      mastra_background_tasks: {
        Row: {
          agent_id: string
          args: Json
          completedAt: string | null
          completedAtZ: string | null
          createdAt: string
          createdAtZ: string | null
          error: Json | null
          id: string
          max_retries: number
          resource_id: string | null
          result: Json | null
          retry_count: number
          run_id: string
          startedAt: string | null
          startedAtZ: string | null
          status: string
          thread_id: string | null
          timeout_ms: number
          tool_call_id: string
          tool_name: string
        }
        Insert: {
          agent_id: string
          args: Json
          completedAt?: string | null
          completedAtZ?: string | null
          createdAt: string
          createdAtZ?: string | null
          error?: Json | null
          id: string
          max_retries: number
          resource_id?: string | null
          result?: Json | null
          retry_count: number
          run_id: string
          startedAt?: string | null
          startedAtZ?: string | null
          status: string
          thread_id?: string | null
          timeout_ms: number
          tool_call_id: string
          tool_name: string
        }
        Update: {
          agent_id?: string
          args?: Json
          completedAt?: string | null
          completedAtZ?: string | null
          createdAt?: string
          createdAtZ?: string | null
          error?: Json | null
          id?: string
          max_retries?: number
          resource_id?: string | null
          result?: Json | null
          retry_count?: number
          run_id?: string
          startedAt?: string | null
          startedAtZ?: string | null
          status?: string
          thread_id?: string | null
          timeout_ms?: number
          tool_call_id?: string
          tool_name?: string
        }
        Relationships: []
      }
      mastra_channel_config: {
        Row: {
          data: Json
          platform: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          data: Json
          platform: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          data?: Json
          platform?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_channel_installations: {
        Row: {
          agentId: string
          configHash: string | null
          createdAt: string
          createdAtZ: string | null
          data: Json
          error: string | null
          id: string
          platform: string
          status: string
          updatedAt: string
          updatedAtZ: string | null
          webhookId: string | null
        }
        Insert: {
          agentId: string
          configHash?: string | null
          createdAt: string
          createdAtZ?: string | null
          data: Json
          error?: string | null
          id: string
          platform: string
          status: string
          updatedAt: string
          updatedAtZ?: string | null
          webhookId?: string | null
        }
        Update: {
          agentId?: string
          configHash?: string | null
          createdAt?: string
          createdAtZ?: string | null
          data?: Json
          error?: string | null
          id?: string
          platform?: string
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
          webhookId?: string | null
        }
        Relationships: []
      }
      mastra_dataset_items: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          datasetId: string
          datasetVersion: number
          expectedTrajectory: Json | null
          groundTruth: Json | null
          id: string
          input: Json
          isDeleted: boolean
          metadata: Json | null
          requestContext: Json | null
          source: Json | null
          updatedAt: string
          updatedAtZ: string | null
          validTo: number | null
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          datasetId: string
          datasetVersion: number
          expectedTrajectory?: Json | null
          groundTruth?: Json | null
          id: string
          input: Json
          isDeleted: boolean
          metadata?: Json | null
          requestContext?: Json | null
          source?: Json | null
          updatedAt: string
          updatedAtZ?: string | null
          validTo?: number | null
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          datasetId?: string
          datasetVersion?: number
          expectedTrajectory?: Json | null
          groundTruth?: Json | null
          id?: string
          input?: Json
          isDeleted?: boolean
          metadata?: Json | null
          requestContext?: Json | null
          source?: Json | null
          updatedAt?: string
          updatedAtZ?: string | null
          validTo?: number | null
        }
        Relationships: []
      }
      mastra_dataset_versions: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          datasetId: string
          id: string
          version: number
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          datasetId: string
          id: string
          version: number
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          datasetId?: string
          id?: string
          version?: number
        }
        Relationships: []
      }
      mastra_datasets: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          description: string | null
          groundTruthSchema: Json | null
          id: string
          inputSchema: Json | null
          metadata: Json | null
          name: string
          requestContextSchema: Json | null
          scorerIds: Json | null
          tags: Json | null
          targetIds: Json | null
          targetType: string | null
          updatedAt: string
          updatedAtZ: string | null
          version: number
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          description?: string | null
          groundTruthSchema?: Json | null
          id: string
          inputSchema?: Json | null
          metadata?: Json | null
          name: string
          requestContextSchema?: Json | null
          scorerIds?: Json | null
          tags?: Json | null
          targetIds?: Json | null
          targetType?: string | null
          updatedAt: string
          updatedAtZ?: string | null
          version: number
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          description?: string | null
          groundTruthSchema?: Json | null
          id?: string
          inputSchema?: Json | null
          metadata?: Json | null
          name?: string
          requestContextSchema?: Json | null
          scorerIds?: Json | null
          tags?: Json | null
          targetIds?: Json | null
          targetType?: string | null
          updatedAt?: string
          updatedAtZ?: string | null
          version?: number
        }
        Relationships: []
      }
      mastra_experiment_results: {
        Row: {
          completedAt: string
          completedAtZ: string | null
          createdAt: string
          createdAtZ: string | null
          error: Json | null
          experimentId: string
          groundTruth: Json | null
          id: string
          input: Json
          itemDatasetVersion: number | null
          itemId: string
          output: Json | null
          retryCount: number
          startedAt: string
          startedAtZ: string | null
          status: string | null
          tags: Json | null
          traceId: string | null
        }
        Insert: {
          completedAt: string
          completedAtZ?: string | null
          createdAt: string
          createdAtZ?: string | null
          error?: Json | null
          experimentId: string
          groundTruth?: Json | null
          id: string
          input: Json
          itemDatasetVersion?: number | null
          itemId: string
          output?: Json | null
          retryCount: number
          startedAt: string
          startedAtZ?: string | null
          status?: string | null
          tags?: Json | null
          traceId?: string | null
        }
        Update: {
          completedAt?: string
          completedAtZ?: string | null
          createdAt?: string
          createdAtZ?: string | null
          error?: Json | null
          experimentId?: string
          groundTruth?: Json | null
          id?: string
          input?: Json
          itemDatasetVersion?: number | null
          itemId?: string
          output?: Json | null
          retryCount?: number
          startedAt?: string
          startedAtZ?: string | null
          status?: string | null
          tags?: Json | null
          traceId?: string | null
        }
        Relationships: []
      }
      mastra_experiments: {
        Row: {
          agentVersion: string | null
          completedAt: string | null
          completedAtZ: string | null
          createdAt: string
          createdAtZ: string | null
          datasetId: string | null
          datasetVersion: number | null
          description: string | null
          failedCount: number
          id: string
          metadata: Json | null
          name: string | null
          skippedCount: number
          startedAt: string | null
          startedAtZ: string | null
          status: string
          succeededCount: number
          targetId: string
          targetType: string
          totalItems: number
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          agentVersion?: string | null
          completedAt?: string | null
          completedAtZ?: string | null
          createdAt: string
          createdAtZ?: string | null
          datasetId?: string | null
          datasetVersion?: number | null
          description?: string | null
          failedCount: number
          id: string
          metadata?: Json | null
          name?: string | null
          skippedCount: number
          startedAt?: string | null
          startedAtZ?: string | null
          status: string
          succeededCount: number
          targetId: string
          targetType: string
          totalItems: number
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          agentVersion?: string | null
          completedAt?: string | null
          completedAtZ?: string | null
          createdAt?: string
          createdAtZ?: string | null
          datasetId?: string | null
          datasetVersion?: number | null
          description?: string | null
          failedCount?: number
          id?: string
          metadata?: Json | null
          name?: string | null
          skippedCount?: number
          startedAt?: string | null
          startedAtZ?: string | null
          status?: string
          succeededCount?: number
          targetId?: string
          targetType?: string
          totalItems?: number
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_mcp_client_versions: {
        Row: {
          changedFields: Json | null
          changeMessage: string | null
          createdAt: string
          createdAtZ: string | null
          description: string | null
          id: string
          mcpClientId: string
          name: string
          servers: Json
          versionNumber: number
        }
        Insert: {
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt: string
          createdAtZ?: string | null
          description?: string | null
          id: string
          mcpClientId: string
          name: string
          servers: Json
          versionNumber: number
        }
        Update: {
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt?: string
          createdAtZ?: string | null
          description?: string | null
          id?: string
          mcpClientId?: string
          name?: string
          servers?: Json
          versionNumber?: number
        }
        Relationships: []
      }
      mastra_mcp_clients: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_mcp_server_versions: {
        Row: {
          agents: Json | null
          changedFields: Json | null
          changeMessage: string | null
          createdAt: string
          createdAtZ: string | null
          description: string | null
          id: string
          instructions: string | null
          isLatest: boolean | null
          mcpServerId: string
          name: string
          packageCanonical: string | null
          releaseDate: string | null
          repository: Json | null
          tools: Json | null
          version: string
          versionNumber: number
          workflows: Json | null
        }
        Insert: {
          agents?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt: string
          createdAtZ?: string | null
          description?: string | null
          id: string
          instructions?: string | null
          isLatest?: boolean | null
          mcpServerId: string
          name: string
          packageCanonical?: string | null
          releaseDate?: string | null
          repository?: Json | null
          tools?: Json | null
          version: string
          versionNumber: number
          workflows?: Json | null
        }
        Update: {
          agents?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt?: string
          createdAtZ?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          isLatest?: boolean | null
          mcpServerId?: string
          name?: string
          packageCanonical?: string | null
          releaseDate?: string | null
          repository?: Json | null
          tools?: Json | null
          version?: string
          versionNumber?: number
          workflows?: Json | null
        }
        Relationships: []
      }
      mastra_mcp_servers: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_messages: {
        Row: {
          content: string
          createdAt: string
          createdAtZ: string | null
          id: string
          resourceId: string | null
          role: string
          thread_id: string
          type: string
        }
        Insert: {
          content: string
          createdAt: string
          createdAtZ?: string | null
          id: string
          resourceId?: string | null
          role: string
          thread_id: string
          type: string
        }
        Update: {
          content?: string
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          resourceId?: string | null
          role?: string
          thread_id?: string
          type?: string
        }
        Relationships: []
      }
      mastra_observational_memory: {
        Row: {
          activeObservations: string
          activeObservationsPendingUpdate: string | null
          bufferedMessageIds: Json | null
          bufferedObservationChunks: Json | null
          bufferedObservations: string | null
          bufferedObservationTokens: number | null
          bufferedReflection: string | null
          bufferedReflectionInputTokens: number | null
          bufferedReflectionTokens: number | null
          config: string
          createdAt: string
          createdAtZ: string | null
          generationCount: number
          id: string
          isBufferingObservation: boolean
          isBufferingReflection: boolean
          isObserving: boolean
          isReflecting: boolean
          lastBufferedAtTime: string | null
          lastBufferedAtTimeZ: string | null
          lastBufferedAtTokens: number
          lastObservedAt: string | null
          lastObservedAtZ: string | null
          lastReflectionAt: string | null
          lastReflectionAtZ: string | null
          lookupKey: string
          metadata: Json | null
          observationTokenCount: number
          observedMessageIds: Json | null
          observedTimezone: string | null
          originType: string
          pendingMessageTokens: number
          reflectedObservationLineCount: number | null
          resourceId: string | null
          scope: string
          threadId: string | null
          totalTokensObserved: number
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeObservations: string
          activeObservationsPendingUpdate?: string | null
          bufferedMessageIds?: Json | null
          bufferedObservationChunks?: Json | null
          bufferedObservations?: string | null
          bufferedObservationTokens?: number | null
          bufferedReflection?: string | null
          bufferedReflectionInputTokens?: number | null
          bufferedReflectionTokens?: number | null
          config: string
          createdAt: string
          createdAtZ?: string | null
          generationCount: number
          id: string
          isBufferingObservation: boolean
          isBufferingReflection: boolean
          isObserving: boolean
          isReflecting: boolean
          lastBufferedAtTime?: string | null
          lastBufferedAtTimeZ?: string | null
          lastBufferedAtTokens: number
          lastObservedAt?: string | null
          lastObservedAtZ?: string | null
          lastReflectionAt?: string | null
          lastReflectionAtZ?: string | null
          lookupKey: string
          metadata?: Json | null
          observationTokenCount: number
          observedMessageIds?: Json | null
          observedTimezone?: string | null
          originType: string
          pendingMessageTokens: number
          reflectedObservationLineCount?: number | null
          resourceId?: string | null
          scope: string
          threadId?: string | null
          totalTokensObserved: number
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeObservations?: string
          activeObservationsPendingUpdate?: string | null
          bufferedMessageIds?: Json | null
          bufferedObservationChunks?: Json | null
          bufferedObservations?: string | null
          bufferedObservationTokens?: number | null
          bufferedReflection?: string | null
          bufferedReflectionInputTokens?: number | null
          bufferedReflectionTokens?: number | null
          config?: string
          createdAt?: string
          createdAtZ?: string | null
          generationCount?: number
          id?: string
          isBufferingObservation?: boolean
          isBufferingReflection?: boolean
          isObserving?: boolean
          isReflecting?: boolean
          lastBufferedAtTime?: string | null
          lastBufferedAtTimeZ?: string | null
          lastBufferedAtTokens?: number
          lastObservedAt?: string | null
          lastObservedAtZ?: string | null
          lastReflectionAt?: string | null
          lastReflectionAtZ?: string | null
          lookupKey?: string
          metadata?: Json | null
          observationTokenCount?: number
          observedMessageIds?: Json | null
          observedTimezone?: string | null
          originType?: string
          pendingMessageTokens?: number
          reflectedObservationLineCount?: number | null
          resourceId?: string | null
          scope?: string
          threadId?: string | null
          totalTokensObserved?: number
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_prompt_block_versions: {
        Row: {
          blockId: string
          changedFields: Json | null
          changeMessage: string | null
          content: string
          createdAt: string
          createdAtZ: string | null
          description: string | null
          id: string
          name: string
          requestContextSchema: Json | null
          rules: Json | null
          versionNumber: number
        }
        Insert: {
          blockId: string
          changedFields?: Json | null
          changeMessage?: string | null
          content: string
          createdAt: string
          createdAtZ?: string | null
          description?: string | null
          id: string
          name: string
          requestContextSchema?: Json | null
          rules?: Json | null
          versionNumber: number
        }
        Update: {
          blockId?: string
          changedFields?: Json | null
          changeMessage?: string | null
          content?: string
          createdAt?: string
          createdAtZ?: string | null
          description?: string | null
          id?: string
          name?: string
          requestContextSchema?: Json | null
          rules?: Json | null
          versionNumber?: number
        }
        Relationships: []
      }
      mastra_prompt_blocks: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_resources: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          updatedAt: string
          updatedAtZ: string | null
          workingMemory: string | null
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          updatedAt: string
          updatedAtZ?: string | null
          workingMemory?: string | null
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          updatedAt?: string
          updatedAtZ?: string | null
          workingMemory?: string | null
        }
        Relationships: []
      }
      mastra_schedule_triggers: {
        Row: {
          actual_fire_at: number
          error: string | null
          id: string
          metadata: Json | null
          outcome: string
          parent_trigger_id: string | null
          run_id: string | null
          schedule_id: string
          scheduled_fire_at: number
          trigger_kind: string
        }
        Insert: {
          actual_fire_at: number
          error?: string | null
          id: string
          metadata?: Json | null
          outcome: string
          parent_trigger_id?: string | null
          run_id?: string | null
          schedule_id: string
          scheduled_fire_at: number
          trigger_kind: string
        }
        Update: {
          actual_fire_at?: number
          error?: string | null
          id?: string
          metadata?: Json | null
          outcome?: string
          parent_trigger_id?: string | null
          run_id?: string | null
          schedule_id?: string
          scheduled_fire_at?: number
          trigger_kind?: string
        }
        Relationships: []
      }
      mastra_schedules: {
        Row: {
          created_at: number
          cron: string
          id: string
          last_fire_at: number | null
          last_run_id: string | null
          metadata: Json | null
          next_fire_at: number
          owner_id: string | null
          owner_type: string | null
          status: string
          target: Json
          timezone: string | null
          updated_at: number
        }
        Insert: {
          created_at: number
          cron: string
          id: string
          last_fire_at?: number | null
          last_run_id?: string | null
          metadata?: Json | null
          next_fire_at: number
          owner_id?: string | null
          owner_type?: string | null
          status: string
          target: Json
          timezone?: string | null
          updated_at: number
        }
        Update: {
          created_at?: number
          cron?: string
          id?: string
          last_fire_at?: number | null
          last_run_id?: string | null
          metadata?: Json | null
          next_fire_at?: number
          owner_id?: string | null
          owner_type?: string | null
          status?: string
          target?: Json
          timezone?: string | null
          updated_at?: number
        }
        Relationships: []
      }
      mastra_scorer_definition_versions: {
        Row: {
          changedFields: Json | null
          changeMessage: string | null
          createdAt: string
          createdAtZ: string | null
          defaultSampling: Json | null
          description: string | null
          id: string
          instructions: string | null
          model: Json | null
          name: string
          presetConfig: Json | null
          scoreRange: Json | null
          scorerDefinitionId: string
          type: string
          versionNumber: number
        }
        Insert: {
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt: string
          createdAtZ?: string | null
          defaultSampling?: Json | null
          description?: string | null
          id: string
          instructions?: string | null
          model?: Json | null
          name: string
          presetConfig?: Json | null
          scoreRange?: Json | null
          scorerDefinitionId: string
          type: string
          versionNumber: number
        }
        Update: {
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt?: string
          createdAtZ?: string | null
          defaultSampling?: Json | null
          description?: string | null
          id?: string
          instructions?: string | null
          model?: Json | null
          name?: string
          presetConfig?: Json | null
          scoreRange?: Json | null
          scorerDefinitionId?: string
          type?: string
          versionNumber?: number
        }
        Relationships: []
      }
      mastra_scorer_definitions: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_scorers: {
        Row: {
          additionalContext: Json | null
          analyzePrompt: string | null
          analyzeStepResult: Json | null
          createdAt: string
          createdAtZ: string | null
          entity: Json | null
          entityId: string | null
          entityType: string | null
          extractPrompt: string | null
          extractStepResult: Json | null
          generateReasonPrompt: string | null
          generateScorePrompt: string | null
          id: string
          input: Json
          metadata: Json | null
          output: Json
          preprocessPrompt: string | null
          preprocessStepResult: Json | null
          reason: string | null
          reasonPrompt: string | null
          requestContext: Json | null
          resourceId: string | null
          runId: string
          score: number
          scorer: Json
          scorerId: string
          source: string
          spanId: string | null
          threadId: string | null
          traceId: string | null
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          additionalContext?: Json | null
          analyzePrompt?: string | null
          analyzeStepResult?: Json | null
          createdAt: string
          createdAtZ?: string | null
          entity?: Json | null
          entityId?: string | null
          entityType?: string | null
          extractPrompt?: string | null
          extractStepResult?: Json | null
          generateReasonPrompt?: string | null
          generateScorePrompt?: string | null
          id: string
          input: Json
          metadata?: Json | null
          output: Json
          preprocessPrompt?: string | null
          preprocessStepResult?: Json | null
          reason?: string | null
          reasonPrompt?: string | null
          requestContext?: Json | null
          resourceId?: string | null
          runId: string
          score: number
          scorer: Json
          scorerId: string
          source: string
          spanId?: string | null
          threadId?: string | null
          traceId?: string | null
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          additionalContext?: Json | null
          analyzePrompt?: string | null
          analyzeStepResult?: Json | null
          createdAt?: string
          createdAtZ?: string | null
          entity?: Json | null
          entityId?: string | null
          entityType?: string | null
          extractPrompt?: string | null
          extractStepResult?: Json | null
          generateReasonPrompt?: string | null
          generateScorePrompt?: string | null
          id?: string
          input?: Json
          metadata?: Json | null
          output?: Json
          preprocessPrompt?: string | null
          preprocessStepResult?: Json | null
          reason?: string | null
          reasonPrompt?: string | null
          requestContext?: Json | null
          resourceId?: string | null
          runId?: string
          score?: number
          scorer?: Json
          scorerId?: string
          source?: string
          spanId?: string | null
          threadId?: string | null
          traceId?: string | null
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_skill_blobs: {
        Row: {
          content: string
          createdAt: string
          createdAtZ: string | null
          hash: string
          mimeType: string | null
          size: number
        }
        Insert: {
          content: string
          createdAt: string
          createdAtZ?: string | null
          hash: string
          mimeType?: string | null
          size: number
        }
        Update: {
          content?: string
          createdAt?: string
          createdAtZ?: string | null
          hash?: string
          mimeType?: string | null
          size?: number
        }
        Relationships: []
      }
      mastra_skill_versions: {
        Row: {
          assets: Json | null
          changedFields: Json | null
          changeMessage: string | null
          compatibility: Json | null
          createdAt: string
          createdAtZ: string | null
          description: string
          id: string
          instructions: string
          license: string | null
          metadata: Json | null
          name: string
          references: Json | null
          scripts: Json | null
          skillId: string
          source: Json | null
          tree: Json | null
          versionNumber: number
        }
        Insert: {
          assets?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          compatibility?: Json | null
          createdAt: string
          createdAtZ?: string | null
          description: string
          id: string
          instructions: string
          license?: string | null
          metadata?: Json | null
          name: string
          references?: Json | null
          scripts?: Json | null
          skillId: string
          source?: Json | null
          tree?: Json | null
          versionNumber: number
        }
        Update: {
          assets?: Json | null
          changedFields?: Json | null
          changeMessage?: string | null
          compatibility?: Json | null
          createdAt?: string
          createdAtZ?: string | null
          description?: string
          id?: string
          instructions?: string
          license?: string | null
          metadata?: Json | null
          name?: string
          references?: Json | null
          scripts?: Json | null
          skillId?: string
          source?: Json | null
          tree?: Json | null
          versionNumber?: number
        }
        Relationships: []
      }
      mastra_skills: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_threads: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          resourceId: string
          title: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          resourceId: string
          title: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          resourceId?: string
          title?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      mastra_workflow_snapshot: {
        Row: {
          createdAt: string
          createdAtZ: string | null
          resourceId: string | null
          run_id: string
          snapshot: Json
          updatedAt: string
          updatedAtZ: string | null
          workflow_name: string
        }
        Insert: {
          createdAt: string
          createdAtZ?: string | null
          resourceId?: string | null
          run_id: string
          snapshot: Json
          updatedAt: string
          updatedAtZ?: string | null
          workflow_name: string
        }
        Update: {
          createdAt?: string
          createdAtZ?: string | null
          resourceId?: string | null
          run_id?: string
          snapshot?: Json
          updatedAt?: string
          updatedAtZ?: string | null
          workflow_name?: string
        }
        Relationships: []
      }
      mastra_workspace_versions: {
        Row: {
          autoSync: boolean | null
          changedFields: Json | null
          changeMessage: string | null
          createdAt: string
          createdAtZ: string | null
          description: string | null
          filesystem: Json | null
          id: string
          mounts: Json | null
          name: string
          operationTimeout: number | null
          sandbox: Json | null
          search: Json | null
          skills: Json | null
          tools: Json | null
          versionNumber: number
          workspaceId: string
        }
        Insert: {
          autoSync?: boolean | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt: string
          createdAtZ?: string | null
          description?: string | null
          filesystem?: Json | null
          id: string
          mounts?: Json | null
          name: string
          operationTimeout?: number | null
          sandbox?: Json | null
          search?: Json | null
          skills?: Json | null
          tools?: Json | null
          versionNumber: number
          workspaceId: string
        }
        Update: {
          autoSync?: boolean | null
          changedFields?: Json | null
          changeMessage?: string | null
          createdAt?: string
          createdAtZ?: string | null
          description?: string | null
          filesystem?: Json | null
          id?: string
          mounts?: Json | null
          name?: string
          operationTimeout?: number | null
          sandbox?: Json | null
          search?: Json | null
          skills?: Json | null
          tools?: Json | null
          versionNumber?: number
          workspaceId?: string
        }
        Relationships: []
      }
      mastra_workspaces: {
        Row: {
          activeVersionId: string | null
          authorId: string | null
          createdAt: string
          createdAtZ: string | null
          id: string
          metadata: Json | null
          status: string
          updatedAt: string
          updatedAtZ: string | null
        }
        Insert: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt: string
          createdAtZ?: string | null
          id: string
          metadata?: Json | null
          status: string
          updatedAt: string
          updatedAtZ?: string | null
        }
        Update: {
          activeVersionId?: string | null
          authorId?: string | null
          createdAt?: string
          createdAtZ?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          updatedAt?: string
          updatedAtZ?: string | null
        }
        Relationships: []
      }
      neighborhood_profiles: {
        Row: {
          digital_nomad_friendliness: number | null
          evidence: Json
          food_quality: number | null
          gym_coworking_proximity: number | null
          local_authenticity: number | null
          luxury_index: number | null
          neighborhood_id: string
          nightlife_density: number | null
          noise_level: number | null
          rooftop_density: number | null
          safety_perception: number | null
          source: string
          summary: string | null
          tourist_density: number | null
          transit_quality: number | null
          updated_at: string
        }
        Insert: {
          digital_nomad_friendliness?: number | null
          evidence?: Json
          food_quality?: number | null
          gym_coworking_proximity?: number | null
          local_authenticity?: number | null
          luxury_index?: number | null
          neighborhood_id: string
          nightlife_density?: number | null
          noise_level?: number | null
          rooftop_density?: number | null
          safety_perception?: number | null
          source?: string
          summary?: string | null
          tourist_density?: number | null
          transit_quality?: number | null
          updated_at?: string
        }
        Update: {
          digital_nomad_friendliness?: number | null
          evidence?: Json
          food_quality?: number | null
          gym_coworking_proximity?: number | null
          local_authenticity?: number | null
          luxury_index?: number | null
          neighborhood_id?: string
          nightlife_density?: number | null
          noise_level?: number | null
          rooftop_density?: number | null
          safety_perception?: number | null
          source?: string
          summary?: string | null
          tourist_density?: number | null
          transit_quality?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhood_profiles_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: true
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          city: string
          created_at: string
          id: string
          metadata: Json
          name: string
          nomad_score: number | null
          safety_score: number | null
          slug: string
          updated_at: string
          walkability_score: number | null
        }
        Insert: {
          city?: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          nomad_score?: number | null
          safety_score?: number | null
          slug: string
          updated_at?: string
          walkability_score?: number | null
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          nomad_score?: number | null
          safety_score?: number | null
          slug?: string
          updated_at?: string
          walkability_score?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          metadata: Json
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      outbox: {
        Row: {
          action: string
          approval_id: string | null
          attempts: number
          channel: string
          created_at: string
          delivered_at: string | null
          id: string
          idempotency_key: string
          last_error: string | null
          next_retry_at: string | null
          payload: Json
          provider_id: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          action: string
          approval_id?: string | null
          attempts?: number
          channel: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          idempotency_key: string
          last_error?: string | null
          next_retry_at?: string | null
          payload: Json
          provider_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          action?: string
          approval_id?: string | null
          attempts?: number
          channel?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          idempotency_key?: string
          last_error?: string | null
          next_retry_at?: string | null
          payload?: Json
          provider_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbox_approval_fk"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_assets: {
        Row: {
          created_at: string
          id: string
          kind: string
          metadata: Json
          mime_type: string | null
          partner_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          mime_type?: string | null
          partner_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          mime_type?: string | null
          partner_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_assets_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_drafts: {
        Row: {
          completion_score: number
          created_at: string
          id: string
          partner_id: string | null
          payload: Json
          profile_id: string
          step: number
          submitted_at: string | null
          thread_id: string | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
        }
        Insert: {
          completion_score?: number
          created_at?: string
          id?: string
          partner_id?: string | null
          payload?: Json
          profile_id: string
          step?: number
          submitted_at?: string | null
          thread_id?: string | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Update: {
          completion_score?: number
          created_at?: string
          id?: string
          partner_id?: string | null
          payload?: Json
          profile_id?: string
          step?: number
          submitted_at?: string | null
          thread_id?: string | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_drafts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_drafts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_locations: {
        Row: {
          address: string | null
          created_at: string
          google_place_id: string | null
          id: string
          is_primary: boolean
          label: string | null
          lat: number | null
          lng: number | null
          metadata: Json
          neighborhood: string | null
          partner_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          is_primary?: boolean
          label?: string | null
          lat?: number | null
          lng?: number | null
          metadata?: Json
          neighborhood?: string | null
          partner_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          google_place_id?: string | null
          id?: string
          is_primary?: boolean
          label?: string | null
          lat?: number | null
          lng?: number | null
          metadata?: Json
          neighborhood?: string | null
          partner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_locations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_members: {
        Row: {
          created_at: string
          partner_id: string
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string
          partner_id: string
          profile_id: string
          role?: string
        }
        Update: {
          created_at?: string
          partner_id?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_members_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_organizations: {
        Row: {
          created_at: string
          display_name: string
          id: string
          legal_name: string
          metadata: Json
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          legal_name: string
          metadata?: Json
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          legal_name?: string
          metadata?: Json
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_services: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          id: string
          partner_id: string
          service_key: string
          tier: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          partner_id: string
          service_key: string
          tier?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          partner_id?: string
          service_key?: string
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_services_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          activated_at: string | null
          completion_score: number
          created_at: string
          id: string
          landlord_profile_id: string | null
          organization_id: string | null
          profile_id: string
          settings: Json
          sponsor_organization_id: string | null
          status: Database["public"]["Enums"]["partner_status"]
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          completion_score?: number
          created_at?: string
          id?: string
          landlord_profile_id?: string | null
          organization_id?: string | null
          profile_id: string
          settings?: Json
          sponsor_organization_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          type: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          completion_score?: number
          created_at?: string
          id?: string
          landlord_profile_id?: string | null
          organization_id?: string | null
          profile_id?: string
          settings?: Json
          sponsor_organization_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_landlord_profile_id_fkey"
            columns: ["landlord_profile_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_landlord_profile_id_fkey"
            columns: ["landlord_profile_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          event_order_id: string | null
          id: string
          metadata: Json
          status: string
          stripe_customer_id: string | null
          stripe_event_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          event_order_id?: string | null
          id?: string
          metadata?: Json
          status?: string
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          event_order_id?: string | null
          id?: string
          metadata?: Json
          status?: string
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_event_order_id_fkey"
            columns: ["event_order_id"]
            isOneToOne: false
            referencedRelation: "event_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      place_details_cache: {
        Row: {
          created_at: string
          display_name: string | null
          expires_at: string
          field_mask_version: string
          google_maps_uri: string | null
          latitude: number | null
          longitude: number | null
          payload: Json
          photo_name_primary: string | null
          place_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          expires_at?: string
          field_mask_version?: string
          google_maps_uri?: string | null
          latitude?: number | null
          longitude?: number | null
          payload: Json
          photo_name_primary?: string | null
          place_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          expires_at?: string
          field_mask_version?: string
          google_maps_uri?: string | null
          latitude?: number | null
          longitude?: number | null
          payload?: Json
          photo_name_primary?: string | null
          place_id?: string
        }
        Relationships: []
      }
      places_search_cache: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          location_key: string
          payload: Json
          query_hash: string
          query_text: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          location_key: string
          payload: Json
          query_hash: string
          query_text: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          location_key?: string
          payload?: Json
          query_hash?: string
          query_text?: string
        }
        Relationships: []
      }
      proactive_suggestions: {
        Row: {
          action_url: string | null
          agent_name: string | null
          confidence_score: number | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          priority: number | null
          reasoning: string | null
          responded_at: string | null
          shown_at: string | null
          status: string | null
          suggestion_data: Json | null
          title: string
          trip_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          agent_name?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          reasoning?: string | null
          responded_at?: string | null
          shown_at?: string | null
          status?: string | null
          suggestion_data?: Json | null
          title: string
          trip_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          agent_name?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          reasoning?: string | null
          responded_at?: string | null
          shown_at?: string | null
          status?: string | null
          suggestion_data?: Json | null
          title?: string
          trip_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proactive_suggestions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proactive_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_enabled: boolean | null
          avatar_url: string | null
          created_at: string
          currency: string | null
          deleted_at: string | null
          email: string
          full_name: string | null
          id: string
          language: string | null
          last_active_at: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          proactive_suggestions_enabled: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          timezone: string | null
          updated_at: string
        }
        Insert: {
          ai_enabled?: boolean | null
          avatar_url?: string | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          email: string
          full_name?: string | null
          id: string
          language?: string | null
          last_active_at?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          proactive_suggestions_enabled?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          ai_enabled?: boolean | null
          avatar_url?: string | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          language?: string | null
          last_active_at?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          proactive_suggestions_enabled?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      property_verifications: {
        Row: {
          apartment_id: string
          created_at: string
          id: string
          metadata: Json
          notes: string | null
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          apartment_id: string
          created_at?: string
          id?: string
          metadata?: Json
          notes?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          apartment_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          notes?: string | null
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_verifications_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: true
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      query_embedding_cache: {
        Row: {
          cache_key: string
          created_at: string
          dimensions: number
          embedding: string
          hit_count: number
          last_used_at: string
          model: string
          query_text_normalized: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          dimensions?: number
          embedding: string
          hit_count?: number
          last_used_at?: string
          model?: string
          query_text_normalized: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          dimensions?: number
          embedding?: string
          hit_count?: number
          last_used_at?: string
          model?: string
          query_text_normalized?: string
        }
        Relationships: []
      }
      rate_limit_hits: {
        Row: {
          bucket_key: string
          count: number
          window_start: string
        }
        Insert: {
          bucket_key: string
          count?: number
          window_start: string
        }
        Update: {
          bucket_key?: string
          count?: number
          window_start?: string
        }
        Relationships: []
      }
      rental_applications: {
        Row: {
          ai_summary: string | null
          apartment_id: string
          applicant_id: string
          created_at: string
          documents: Json
          id: string
          lead_id: string | null
          metadata: Json
          status: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          apartment_id: string
          applicant_id: string
          created_at?: string
          documents?: Json
          id?: string
          lead_id?: string | null
          metadata?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          apartment_id?: string
          applicant_id?: string
          created_at?: string
          documents?: Json
          id?: string
          lead_id?: string | null
          metadata?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_applications_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_freshness_log: {
        Row: {
          checked_at: string
          created_at: string
          html_signature_match: boolean | null
          http_status: number | null
          id: string
          listing_id: string
          status: string
        }
        Insert: {
          checked_at?: string
          created_at?: string
          html_signature_match?: boolean | null
          http_status?: number | null
          id?: string
          listing_id: string
          status: string
        }
        Update: {
          checked_at?: string
          created_at?: string
          html_signature_match?: boolean | null
          http_status?: number | null
          id?: string
          listing_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_freshness_log_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_grounding: {
        Row: {
          apartment_id: string
          checked_at: string | null
          confidence: number | null
          extracted_text: string | null
          id: string
          source_type: string
          source_url: string | null
        }
        Insert: {
          apartment_id: string
          checked_at?: string | null
          confidence?: number | null
          extracted_text?: string | null
          id?: string
          source_type: string
          source_url?: string | null
        }
        Update: {
          apartment_id?: string
          checked_at?: string | null
          confidence?: number | null
          extracted_text?: string | null
          id?: string
          source_type?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_grounding_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_listing_images: {
        Row: {
          created_at: string
          height: number | null
          id: string
          listing_id: string
          mime_type: string | null
          sort_order: number | null
          source_url: string | null
          storage_path: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          listing_id: string
          mime_type?: string | null
          sort_order?: number | null
          source_url?: string | null
          storage_path: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          listing_id?: string
          mime_type?: string | null
          sort_order?: number | null
          source_url?: string | null
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_listing_sources: {
        Row: {
          base_url: string | null
          created_at: string
          id: string
          is_enabled: boolean
          last_crawl_at: string | null
          rate_limit_config: Json
          source_key: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_crawl_at?: string | null
          rate_limit_config?: Json
          source_key: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_crawl_at?: string | null
          rate_limit_config?: Json
          source_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      rental_search_sessions: {
        Row: {
          created_at: string
          filter_json: Json
          id: string
          result_ids: string[]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filter_json?: Json
          id?: string
          result_ids?: string[]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filter_json?: Json
          id?: string
          result_ids?: string[]
          user_id?: string | null
        }
        Relationships: []
      }
      rental_signals: {
        Row: {
          apartment_id: string
          confidence: number
          digital_nomad_score: number | null
          evidence: Json
          generated_at: string
          local_authenticity: number | null
          luxury_score: number | null
          model_version: string | null
          nightlife_access: number | null
          quiet_score: number | null
          safety_score: number | null
          source: string
          tourist_density: number | null
          updated_at: string
          value_score: number | null
          walkability: number | null
          workspace_score: number | null
        }
        Insert: {
          apartment_id: string
          confidence?: number
          digital_nomad_score?: number | null
          evidence?: Json
          generated_at?: string
          local_authenticity?: number | null
          luxury_score?: number | null
          model_version?: string | null
          nightlife_access?: number | null
          quiet_score?: number | null
          safety_score?: number | null
          source?: string
          tourist_density?: number | null
          updated_at?: string
          value_score?: number | null
          walkability?: number | null
          workspace_score?: number | null
        }
        Update: {
          apartment_id?: string
          confidence?: number
          digital_nomad_score?: number | null
          evidence?: Json
          generated_at?: string
          local_authenticity?: number | null
          luxury_score?: number | null
          model_version?: string | null
          nightlife_access?: number | null
          quiet_score?: number | null
          safety_score?: number | null
          source?: string
          tourist_density?: number | null
          updated_at?: string
          value_score?: number | null
          walkability?: number | null
          workspace_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_signals_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: true
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_embeddings: {
        Row: {
          content_hash: string | null
          embedding: string
          id: string
          model: string
          restaurant_id: string
          updated_at: string | null
        }
        Insert: {
          content_hash?: string | null
          embedding: string
          id?: string
          model?: string
          restaurant_id: string
          updated_at?: string | null
        }
        Update: {
          content_hash?: string | null
          embedding?: string
          id?: string
          model?: string
          restaurant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_embeddings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          ai_summary: string | null
          ambiance: string[] | null
          cache_expires_at: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          cuisine_types: string[]
          data_freshness: string | null
          description: string | null
          details: Json | null
          dietary_options: string[] | null
          email: string | null
          external_id: string | null
          fts_content: unknown
          google_place_id: string | null
          hours_of_operation: Json | null
          id: string
          images: Json | null
          is_active: boolean
          is_open_now: boolean | null
          is_verified: boolean
          latitude: number | null
          longitude: number | null
          maps_url: string | null
          name: string
          neighborhood: string | null
          phone: string | null
          postal_code: string | null
          price_level: number | null
          primary_image_url: string | null
          rating: number | null
          rating_count: number | null
          source: string
          state: string | null
          subcategory: string | null
          tags: string[] | null
          updated_at: string
          website: string | null
          yelp_id: string | null
        }
        Insert: {
          address?: string | null
          ai_summary?: string | null
          ambiance?: string[] | null
          cache_expires_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          cuisine_types?: string[]
          data_freshness?: string | null
          description?: string | null
          details?: Json | null
          dietary_options?: string[] | null
          email?: string | null
          external_id?: string | null
          fts_content?: unknown
          google_place_id?: string | null
          hours_of_operation?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_open_now?: boolean | null
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          primary_image_url?: string | null
          rating?: number | null
          rating_count?: number | null
          source?: string
          state?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
          yelp_id?: string | null
        }
        Update: {
          address?: string | null
          ai_summary?: string | null
          ambiance?: string[] | null
          cache_expires_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          cuisine_types?: string[]
          data_freshness?: string | null
          description?: string | null
          details?: Json | null
          dietary_options?: string[] | null
          email?: string | null
          external_id?: string | null
          fts_content?: unknown
          google_place_id?: string | null
          hours_of_operation?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean
          is_open_now?: boolean | null
          is_verified?: boolean
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          postal_code?: string | null
          price_level?: number | null
          primary_image_url?: string | null
          rating?: number | null
          rating_count?: number | null
          source?: string
          state?: string | null
          subcategory?: string | null
          tags?: string[] | null
          updated_at?: string
          website?: string | null
          yelp_id?: string | null
        }
        Relationships: []
      }
      revenue_ledger: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          idempotency_key: string | null
          metadata: Json
          partner_id: string
          platform_fee_cents: number
          source_id: string | null
          source_kind: string
          stripe_reference: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          partner_id: string
          platform_fee_cents?: number
          source_id?: string | null
          source_kind: string
          stripe_reference?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          partner_id?: string
          platform_fee_cents?: number
          source_id?: string | null
          source_kind?: string
          stripe_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_ledger_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_places: {
        Row: {
          collection_id: string | null
          id: string
          is_favorite: boolean | null
          last_viewed_at: string | null
          location_id: string
          location_type: string
          notes: string | null
          priority: number | null
          saved_at: string
          tags: string[] | null
          trip_id: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          collection_id?: string | null
          id?: string
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          location_id: string
          location_type: string
          notes?: string | null
          priority?: number | null
          saved_at?: string
          tags?: string[] | null
          trip_id?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          collection_id?: string | null
          id?: string
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          location_id?: string
          location_type?: string
          notes?: string | null
          priority?: number | null
          saved_at?: string
          tags?: string[] | null
          trip_id?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_places_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_places_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_places_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_grounding_quota_log: {
        Row: {
          count: number
          date: string
        }
        Insert: {
          count?: number
          date?: string
        }
        Update: {
          count?: number
          date?: string
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          clicked_entity_id: string | null
          clicked_entity_type: string | null
          created_at: string
          grounding_used: boolean
          hybrid_used: boolean
          id: string
          intent: string | null
          latency_ms: number
          query_text: string
          rank_explanation: Json
          results_count: number
          session_id: string | null
          slots: Json
          tool_name: string
          user_id: string | null
          zero_results: boolean | null
        }
        Insert: {
          clicked_entity_id?: string | null
          clicked_entity_type?: string | null
          created_at?: string
          grounding_used?: boolean
          hybrid_used?: boolean
          id?: string
          intent?: string | null
          latency_ms: number
          query_text: string
          rank_explanation?: Json
          results_count?: number
          session_id?: string | null
          slots?: Json
          tool_name: string
          user_id?: string | null
          zero_results?: boolean | null
        }
        Update: {
          clicked_entity_id?: string | null
          clicked_entity_type?: string | null
          created_at?: string
          grounding_used?: boolean
          hybrid_used?: boolean
          id?: string
          intent?: string | null
          latency_ms?: number
          query_text?: string
          rank_explanation?: Json
          results_count?: number
          session_id?: string | null
          slots?: Json
          tool_name?: string
          user_id?: string | null
          zero_results?: boolean | null
        }
        Relationships: []
      }
      showings: {
        Row: {
          apartment_id: string
          created_at: string
          host_notes: string | null
          id: string
          lead_id: string
          metadata: Json
          renter_notes: string | null
          scheduled_at: string
          status: string
          trip_id: string | null
          updated_at: string
        }
        Insert: {
          apartment_id: string
          created_at?: string
          host_notes?: string | null
          id?: string
          lead_id: string
          metadata?: Json
          renter_notes?: string | null
          scheduled_at: string
          status?: string
          trip_id?: string | null
          updated_at?: string
        }
        Update: {
          apartment_id?: string
          created_at?: string
          host_notes?: string | null
          id?: string
          lead_id?: string
          metadata?: Json
          renter_notes?: string | null
          scheduled_at?: string
          status?: string
          trip_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "showings_apartment_id_fkey"
            columns: ["apartment_id"]
            isOneToOne: false
            referencedRelation: "apartments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_generation_logs: {
        Row: {
          confidence: number | null
          created_at: string
          entity_id: string
          error_message: string | null
          id: string
          model_version: string | null
          signal_table: string
          source: string
          status: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          entity_id: string
          error_message?: string | null
          id?: string
          model_version?: string | null
          signal_table: string
          source: string
          status: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          entity_id?: string
          error_message?: string | null
          id?: string
          model_version?: string | null
          signal_table?: string
          source?: string
          status?: string
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      suppression_list: {
        Row: {
          channel: string
          created_at: string
          expires_at: string | null
          id: string
          identifier: string
          reason: string
          source: string
          source_event: Json | null
        }
        Insert: {
          channel: string
          created_at?: string
          expires_at?: string | null
          id?: string
          identifier: string
          reason: string
          source?: string
          source_event?: Json | null
        }
        Update: {
          channel?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          identifier?: string
          reason?: string
          source?: string
          source_event?: Json | null
        }
        Relationships: []
      }
      tourist_destinations: {
        Row: {
          accessibility_features: string[] | null
          address: string | null
          age_max: number | null
          age_min: number | null
          ai_summary: string | null
          audio_guide_available: boolean | null
          audio_guide_languages: string[] | null
          best_for: string[] | null
          best_time_to_visit: string | null
          booking_required: boolean | null
          booking_url: string | null
          cache_expires_at: string | null
          cancellation_policy: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          crowd_level: string | null
          currency: string | null
          data_freshness: string | null
          departure_times: string[] | null
          description: string | null
          details: Json | null
          difficulty_level: string | null
          email: string | null
          entry_fee: string | null
          entry_fee_amount: number | null
          estimated_visit_duration: string | null
          external_id: string | null
          facebook_url: string | null
          family_friendly: boolean | null
          google_place_id: string | null
          group_size_max: number | null
          group_size_min: number | null
          guided_tour_available: boolean | null
          id: string
          images: Json | null
          instagram_handle: string | null
          is_active: boolean
          is_open_now: boolean | null
          is_verified: boolean
          languages_available: string[] | null
          latitude: number | null
          longitude: number | null
          maps_url: string | null
          name: string
          nearby_attractions: string[] | null
          opening_hours: Json | null
          parking_available: boolean | null
          parking_fee: number | null
          peak_season: string | null
          pet_friendly: boolean | null
          phone: string | null
          physical_requirements: string | null
          pickup_location: string | null
          pickup_location_lat: number | null
          pickup_location_lng: number | null
          postal_code: string | null
          primary_image_url: string | null
          public_transport_access: string | null
          rating: number | null
          rating_count: number | null
          related_destinations: string[] | null
          seasonal_availability: string | null
          seasonal_end: string | null
          seasonal_start: string | null
          self_guided: boolean | null
          source: string
          state: string | null
          stroller_accessible: boolean | null
          subcategory: string | null
          tags: string[] | null
          tour_duration_hours: number | null
          tour_duration_text: string | null
          tour_exclusions: string[] | null
          tour_inclusions: string[] | null
          tour_operator: string | null
          tour_operator_website: string | null
          tripadvisor_id: string | null
          tripadvisor_url: string | null
          twitter_handle: string | null
          updated_at: string
          video_url: string | null
          virtual_tour_url: string | null
          weather_dependent: boolean | null
          website: string | null
          what_to_bring: string[] | null
          wheelchair_accessible: boolean | null
          youtube_url: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          address?: string | null
          age_max?: number | null
          age_min?: number | null
          ai_summary?: string | null
          audio_guide_available?: boolean | null
          audio_guide_languages?: string[] | null
          best_for?: string[] | null
          best_time_to_visit?: string | null
          booking_required?: boolean | null
          booking_url?: string | null
          cache_expires_at?: string | null
          cancellation_policy?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          crowd_level?: string | null
          currency?: string | null
          data_freshness?: string | null
          departure_times?: string[] | null
          description?: string | null
          details?: Json | null
          difficulty_level?: string | null
          email?: string | null
          entry_fee?: string | null
          entry_fee_amount?: number | null
          estimated_visit_duration?: string | null
          external_id?: string | null
          facebook_url?: string | null
          family_friendly?: boolean | null
          google_place_id?: string | null
          group_size_max?: number | null
          group_size_min?: number | null
          guided_tour_available?: boolean | null
          id?: string
          images?: Json | null
          instagram_handle?: string | null
          is_active?: boolean
          is_open_now?: boolean | null
          is_verified?: boolean
          languages_available?: string[] | null
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name: string
          nearby_attractions?: string[] | null
          opening_hours?: Json | null
          parking_available?: boolean | null
          parking_fee?: number | null
          peak_season?: string | null
          pet_friendly?: boolean | null
          phone?: string | null
          physical_requirements?: string | null
          pickup_location?: string | null
          pickup_location_lat?: number | null
          pickup_location_lng?: number | null
          postal_code?: string | null
          primary_image_url?: string | null
          public_transport_access?: string | null
          rating?: number | null
          rating_count?: number | null
          related_destinations?: string[] | null
          seasonal_availability?: string | null
          seasonal_end?: string | null
          seasonal_start?: string | null
          self_guided?: boolean | null
          source?: string
          state?: string | null
          stroller_accessible?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          tour_duration_hours?: number | null
          tour_duration_text?: string | null
          tour_exclusions?: string[] | null
          tour_inclusions?: string[] | null
          tour_operator?: string | null
          tour_operator_website?: string | null
          tripadvisor_id?: string | null
          tripadvisor_url?: string | null
          twitter_handle?: string | null
          updated_at?: string
          video_url?: string | null
          virtual_tour_url?: string | null
          weather_dependent?: boolean | null
          website?: string | null
          what_to_bring?: string[] | null
          wheelchair_accessible?: boolean | null
          youtube_url?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          address?: string | null
          age_max?: number | null
          age_min?: number | null
          ai_summary?: string | null
          audio_guide_available?: boolean | null
          audio_guide_languages?: string[] | null
          best_for?: string[] | null
          best_time_to_visit?: string | null
          booking_required?: boolean | null
          booking_url?: string | null
          cache_expires_at?: string | null
          cancellation_policy?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          crowd_level?: string | null
          currency?: string | null
          data_freshness?: string | null
          departure_times?: string[] | null
          description?: string | null
          details?: Json | null
          difficulty_level?: string | null
          email?: string | null
          entry_fee?: string | null
          entry_fee_amount?: number | null
          estimated_visit_duration?: string | null
          external_id?: string | null
          facebook_url?: string | null
          family_friendly?: boolean | null
          google_place_id?: string | null
          group_size_max?: number | null
          group_size_min?: number | null
          guided_tour_available?: boolean | null
          id?: string
          images?: Json | null
          instagram_handle?: string | null
          is_active?: boolean
          is_open_now?: boolean | null
          is_verified?: boolean
          languages_available?: string[] | null
          latitude?: number | null
          longitude?: number | null
          maps_url?: string | null
          name?: string
          nearby_attractions?: string[] | null
          opening_hours?: Json | null
          parking_available?: boolean | null
          parking_fee?: number | null
          peak_season?: string | null
          pet_friendly?: boolean | null
          phone?: string | null
          physical_requirements?: string | null
          pickup_location?: string | null
          pickup_location_lat?: number | null
          pickup_location_lng?: number | null
          postal_code?: string | null
          primary_image_url?: string | null
          public_transport_access?: string | null
          rating?: number | null
          rating_count?: number | null
          related_destinations?: string[] | null
          seasonal_availability?: string | null
          seasonal_end?: string | null
          seasonal_start?: string | null
          self_guided?: boolean | null
          source?: string
          state?: string | null
          stroller_accessible?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          tour_duration_hours?: number | null
          tour_duration_text?: string | null
          tour_exclusions?: string[] | null
          tour_inclusions?: string[] | null
          tour_operator?: string | null
          tour_operator_website?: string | null
          tripadvisor_id?: string | null
          tripadvisor_url?: string | null
          twitter_handle?: string | null
          updated_at?: string
          video_url?: string | null
          virtual_tour_url?: string | null
          weather_dependent?: boolean | null
          website?: string | null
          what_to_bring?: string[] | null
          wheelchair_accessible?: boolean | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      trip_items: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          id: string
          item_type: string
          latitude: number | null
          location_name: string | null
          longitude: number | null
          metadata: Json | null
          source_id: string
          start_at: string | null
          title: string
          trip_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          item_type: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          source_id: string
          start_at?: string | null
          title: string
          trip_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          item_type?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          metadata?: Json | null
          source_id?: string
          start_at?: string | null
          title?: string
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget: number | null
          created_at: string
          currency: string | null
          deleted_at: string | null
          description: string | null
          destination: string | null
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          destination?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          currency?: string | null
          deleted_at?: string | null
          description?: string | null
          destination?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          adventure_level: string | null
          ai_proactivity_level: string | null
          ai_suggestion_frequency: string | null
          ambiance_preferences: string[] | null
          created_at: string
          default_budget_per_day: number | null
          default_currency: string | null
          dietary_restrictions: string[] | null
          event_categories: string[] | null
          event_price_range: string | null
          favorite_cuisines: string[] | null
          id: string
          language: string | null
          notification_preferences: Json | null
          persona: string | null
          preferred_event_times: string[] | null
          preferred_neighborhoods: string[] | null
          price_range_preference: string | null
          rental_bedrooms: number | null
          rental_budget_max: number | null
          rental_budget_min: number | null
          rental_features: string[] | null
          travel_style: string[] | null
          updated_at: string
          user_id: string
          vehicle_types: string[] | null
          whatsapp_opted_in: boolean | null
          whatsapp_phone: string | null
        }
        Insert: {
          adventure_level?: string | null
          ai_proactivity_level?: string | null
          ai_suggestion_frequency?: string | null
          ambiance_preferences?: string[] | null
          created_at?: string
          default_budget_per_day?: number | null
          default_currency?: string | null
          dietary_restrictions?: string[] | null
          event_categories?: string[] | null
          event_price_range?: string | null
          favorite_cuisines?: string[] | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          persona?: string | null
          preferred_event_times?: string[] | null
          preferred_neighborhoods?: string[] | null
          price_range_preference?: string | null
          rental_bedrooms?: number | null
          rental_budget_max?: number | null
          rental_budget_min?: number | null
          rental_features?: string[] | null
          travel_style?: string[] | null
          updated_at?: string
          user_id: string
          vehicle_types?: string[] | null
          whatsapp_opted_in?: boolean | null
          whatsapp_phone?: string | null
        }
        Update: {
          adventure_level?: string | null
          ai_proactivity_level?: string | null
          ai_suggestion_frequency?: string | null
          ambiance_preferences?: string[] | null
          created_at?: string
          default_budget_per_day?: number | null
          default_currency?: string | null
          dietary_restrictions?: string[] | null
          event_categories?: string[] | null
          event_price_range?: string | null
          favorite_cuisines?: string[] | null
          id?: string
          language?: string | null
          notification_preferences?: Json | null
          persona?: string | null
          preferred_event_times?: string[] | null
          preferred_neighborhoods?: string[] | null
          price_range_preference?: string | null
          rental_bedrooms?: number | null
          rental_budget_max?: number | null
          rental_budget_min?: number | null
          rental_features?: string[] | null
          travel_style?: string[] | null
          updated_at?: string
          user_id?: string
          vehicle_types?: string[] | null
          whatsapp_opted_in?: boolean | null
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venue_anchors: {
        Row: {
          city: string
          created_at: string
          google_place_id: string
          id: string
          is_active: boolean
          kind: string
          latitude: number | null
          longitude: number | null
          metadata: Json
          name: string
          neighborhood: string | null
          source: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          city?: string
          created_at?: string
          google_place_id: string
          id?: string
          is_active?: boolean
          kind: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json
          name: string
          neighborhood?: string | null
          source?: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          google_place_id?: string
          id?: string
          is_active?: boolean
          kind?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json
          name?: string
          neighborhood?: string | null
          source?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      venue_booking_requests: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          id: string
          idempotency_key: string | null
          metadata: Json
          notes: string | null
          party_size: number | null
          place_id: string
          requested_at: string
          restaurant_id: string | null
          source: string
          status: string
          updated_at: string
          user_id: string | null
          venue_anchor_id: string | null
          venue_kind: string
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          notes?: string | null
          party_size?: number | null
          place_id: string
          requested_at: string
          restaurant_id?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          venue_anchor_id?: string | null
          venue_kind: string
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          idempotency_key?: string | null
          metadata?: Json
          notes?: string | null
          party_size?: number | null
          place_id?: string
          requested_at?: string
          restaurant_id?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          venue_anchor_id?: string | null
          venue_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_booking_anchor_fk"
            columns: ["venue_anchor_id"]
            isOneToOne: false
            referencedRelation: "venue_anchors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_booking_requests_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_signals: {
        Row: {
          brunch_score: number | null
          cocktail_score: number | null
          confidence: number
          created_at: string
          date_night_score: number | null
          digital_nomad_score: number | null
          evidence: Json
          generated_at: string
          hidden_gem_score: number | null
          id: string
          local_authenticity_score: number | null
          model_version: string | null
          nightlife_score: number | null
          quiet_score: number | null
          restaurant_id: string | null
          rooftop_score: number | null
          service_score: number | null
          source: string
          touristy_score: number | null
          updated_at: string
          value_score: number | null
          venue_anchor_id: string | null
          venue_kind: string
          wifi_score: number | null
        }
        Insert: {
          brunch_score?: number | null
          cocktail_score?: number | null
          confidence?: number
          created_at?: string
          date_night_score?: number | null
          digital_nomad_score?: number | null
          evidence?: Json
          generated_at?: string
          hidden_gem_score?: number | null
          id?: string
          local_authenticity_score?: number | null
          model_version?: string | null
          nightlife_score?: number | null
          quiet_score?: number | null
          restaurant_id?: string | null
          rooftop_score?: number | null
          service_score?: number | null
          source?: string
          touristy_score?: number | null
          updated_at?: string
          value_score?: number | null
          venue_anchor_id?: string | null
          venue_kind: string
          wifi_score?: number | null
        }
        Update: {
          brunch_score?: number | null
          cocktail_score?: number | null
          confidence?: number
          created_at?: string
          date_night_score?: number | null
          digital_nomad_score?: number | null
          evidence?: Json
          generated_at?: string
          hidden_gem_score?: number | null
          id?: string
          local_authenticity_score?: number | null
          model_version?: string | null
          nightlife_score?: number | null
          quiet_score?: number | null
          restaurant_id?: string | null
          rooftop_score?: number | null
          service_score?: number | null
          source?: string
          touristy_score?: number | null
          updated_at?: string
          value_score?: number | null
          venue_anchor_id?: string | null
          venue_kind?: string
          wifi_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_signals_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_signals_venue_anchor_id_fkey"
            columns: ["venue_anchor_id"]
            isOneToOne: false
            referencedRelation: "venue_anchors"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_source_evidence: {
        Row: {
          checked_at: string | null
          confidence: number | null
          created_at: string
          extracted_text: string | null
          id: string
          restaurant_id: string | null
          source_title: string | null
          source_type: string
          source_url: string | null
          venue_anchor_id: string | null
          venue_kind: string
        }
        Insert: {
          checked_at?: string | null
          confidence?: number | null
          created_at?: string
          extracted_text?: string | null
          id?: string
          restaurant_id?: string | null
          source_title?: string | null
          source_type: string
          source_url?: string | null
          venue_anchor_id?: string | null
          venue_kind: string
        }
        Update: {
          checked_at?: string | null
          confidence?: number | null
          created_at?: string
          extracted_text?: string | null
          id?: string
          restaurant_id?: string | null
          source_title?: string | null
          source_type?: string
          source_url?: string | null
          venue_anchor_id?: string | null
          venue_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "venue_source_evidence_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_source_evidence_venue_anchor_id_fkey"
            columns: ["venue_anchor_id"]
            isOneToOne: false
            referencedRelation: "venue_anchors"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          doc_kind: string
          expires_at: string | null
          id: string
          landlord_id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          storage_path: string
          uploaded_at: string
        }
        Insert: {
          doc_kind: string
          expires_at?: string | null
          id?: string
          landlord_id: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path: string
          uploaded_at?: string
        }
        Update: {
          doc_kind?: string
          expires_at?: string | null
          id?: string
          landlord_id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_outbox: {
        Row: {
          attempts: number
          created_at: string
          id: string
          idempotency_key: string | null
          last_error: string | null
          next_attempt_at: string
          payload: Json
          sent_at: string | null
          status: string
          to_e164: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          next_attempt_at?: string
          payload?: Json
          sent_at?: string | null
          status?: string
          to_e164: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          idempotency_key?: string | null
          last_error?: string | null
          next_attempt_at?: string
          payload?: Json
          sent_at?: string | null
          status?: string
          to_e164?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          message_count: number
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          message_count?: number
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          message_count?: number
          phone_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string
          created_at: string
          direction: string
          external_id: string | null
          id: string
          message_type: string | null
          phone_number: string
          raw_payload: Json | null
          sender: string
          status: string | null
          to_number: string | null
        }
        Insert: {
          content: string
          created_at?: string
          direction: string
          external_id?: string | null
          id?: string
          message_type?: string | null
          phone_number: string
          raw_payload?: Json | null
          sender: string
          status?: string | null
          to_number?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          direction?: string
          external_id?: string | null
          id?: string
          message_type?: string | null
          phone_number?: string
          raw_payload?: Json | null
          sender?: string
          status?: string | null
          to_number?: string | null
        }
        Relationships: []
      }
      whatsapp_subscriptions: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          last_notified_at: string | null
          notification_frequency: string | null
          opted_in: boolean | null
          phone_e164: string
          saved_search: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_notified_at?: string | null
          notification_frequency?: string | null
          opted_in?: boolean | null
          phone_e164: string
          saved_search?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          last_notified_at?: string | null
          notification_frequency?: string | null
          opted_in?: boolean | null
          phone_e164?: string
          saved_search?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      landlord_profiles_public: {
        Row: {
          active_listings: number | null
          avatar_url: string | null
          bio: string | null
          display_name: string | null
          id: string | null
          is_verified: boolean | null
          languages: string[] | null
          median_response_time_minutes: number | null
          primary_neighborhood: string | null
          total_leads_received: number | null
          verified_at: string | null
        }
        Insert: {
          active_listings?: number | null
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          id?: string | null
          is_verified?: never
          languages?: string[] | null
          median_response_time_minutes?: number | null
          primary_neighborhood?: string | null
          total_leads_received?: number | null
          verified_at?: string | null
        }
        Update: {
          active_listings?: number | null
          avatar_url?: string | null
          bio?: string | null
          display_name?: string | null
          id?: string | null
          is_verified?: never
          languages?: string[] | null
          median_response_time_minutes?: number | null
          primary_neighborhood?: string | null
          total_leads_received?: number | null
          verified_at?: string | null
        }
        Relationships: []
      }
      landlord_response_metrics: {
        Row: {
          active_leads: number | null
          archived_leads: number | null
          landlord_id: string | null
          median_ttfr_seconds: number | null
          new_leads: number | null
          replied_leads: number | null
          replied_with_ttfr: number | null
          reply_rate_pct: number | null
          total_leads: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_inbox_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landlord_inbox_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord_profiles_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      acting_landlord_ids: { Args: never; Returns: string[] }
      activate_placements_if_ready: {
        Args: { p_application_id: string }
        Returns: number
      }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      apartment_save_counts: {
        Args: { apartment_ids: string[] }
        Returns: {
          apartment_id: string
          save_count: number
        }[]
      }
      approve_sponsor_application: {
        Args: { p_application_id: string; p_approved_by: string }
        Returns: undefined
      }
      bump_staff_link_version: { Args: { p_event_id: string }; Returns: number }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      check_rate_limit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number }
        Returns: Json
      }
      claim_agent_job: {
        Args: { p_job_types?: string[]; p_worker_id: string }
        Returns: string
      }
      cleanup_expired_agent_jobs: { Args: never; Returns: number }
      complete_agent_job: {
        Args: { p_job_id: string; p_result: Json }
        Returns: boolean
      }
      compute_ticket_total: {
        Args: {
          p_discount_cents?: number
          p_quantity: number
          p_ticket_id: string
        }
        Returns: Json
      }
      decide_approval: {
        Args: { p_decision: string; p_reason?: string; p_request_id: string }
        Returns: undefined
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      event_attendees_paginated: {
        Args: {
          p_event_id: string
          p_limit?: number
          p_offset?: number
          p_search?: string
        }
        Returns: Json
      }
      event_dashboard_summary: { Args: { p_event_id: string }; Returns: Json }
      fail_agent_job: {
        Args: { p_error: string; p_job_id: string }
        Returns: boolean
      }
      fn_insert_conversation: { Args: { p_data: Json }; Returns: string }
      fn_join_wait_list: {
        Args: {
          p_email: string
          p_phone?: string
          p_ticket_type_id: string
          p_user_id: string
        }
        Returns: Json
      }
      fn_notify_next_in_line: {
        Args: { p_ticket_type_id: string }
        Returns: Json
      }
      fn_record_conversion: {
        Args: {
          p_conversion_type: string
          p_metadata?: Json
          p_subject_id: string
          p_subject_table: string
          p_user_id?: string
          p_value_cents?: number
        }
        Returns: Json
      }
      fn_record_tool_call_end: {
        Args: {
          p_error?: string
          p_output_json?: Json
          p_status: string
          p_tool_call_id: string
        }
        Returns: undefined
      }
      fn_record_tool_call_start: {
        Args: {
          p_agent_name?: string
          p_agent_run_id: string
          p_ai_run_id?: string
          p_call_index: number
          p_input_json?: Json
          p_tool_name: string
        }
        Returns: string
      }
      fn_update_conversation_intent: {
        Args: {
          p_confidence: number
          p_intent: string
          p_message_id: string
          p_reply: string
        }
        Returns: undefined
      }
      fn_upsert_delivery_log: { Args: { p_data: Json }; Returns: undefined }
      fts_array_to_text: { Args: { arr: string[] }; Returns: string }
      fts_spanish: { Args: { content: string }; Returns: unknown }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_anonymous_order: {
        Args: { p_access_token: string; p_order_id: string }
        Returns: Json
      }
      get_landlord_public_profile: {
        Args: { landlord_uuid: string }
        Returns: {
          active_listings: number
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          is_verified: boolean
          languages: string[]
          median_response_time_minutes: number
          primary_neighborhood: string
          total_leads_received: number
          verified_at: string
        }[]
      }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hybrid_search_events: {
        Args: {
          fts_weight?: number
          match_count?: number
          query_embedding: string
          query_text: string
          rrf_k?: number
          semantic_weight?: number
        }
        Returns: {
          address: string
          description: string
          event_start_time: string
          event_type: string
          id: string
          name: string
          primary_image_url: string
          rating: number
          similarity: number
          tags: string[]
          ticket_price_min: number
        }[]
      }
      hybrid_search_listings: {
        Args: {
          fts_weight?: number
          match_count?: number
          query_embedding: string
          query_text: string
          rrf_k?: number
          semantic_weight?: number
        }
        Returns: {
          amenities: string[]
          bathrooms: number
          bedrooms: number
          city: string
          description: string
          furnished: boolean
          id: string
          images: string[]
          neighborhood: string
          pet_friendly: boolean
          price_monthly: number
          rating: number
          similarity: number
          status: string
          title: string
        }[]
      }
      hybrid_search_restaurants: {
        Args: {
          fts_weight?: number
          match_count?: number
          query_embedding: string
          query_text: string
          rrf_k?: number
          semantic_weight?: number
        }
        Returns: {
          address: string
          ambiance: string[]
          city: string
          cuisine_types: string[]
          description: string
          dietary_options: string[]
          id: string
          name: string
          price_level: number
          primary_image_url: string
          rating: number
          similarity: number
        }[]
      }
      insert_trip_item_for_user: {
        Args: {
          p_end_at?: string
          p_item_type: string
          p_source_id: string
          p_start_at?: string
          p_title?: string
          p_trip_id: string
        }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
      is_suppressed: {
        Args: { p_channel: string; p_identifier: string }
        Returns: boolean
      }
      log_outbound_click: {
        Args: {
          p_affiliate_tag?: string
          p_listing_id: string
          p_source_url: string
          p_surface?: string
        }
        Returns: string
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      outbox_claim: {
        Args: { p_channel: string; p_limit?: number }
        Returns: {
          action: string
          approval_id: string | null
          attempts: number
          channel: string
          created_at: string
          delivered_at: string | null
          id: string
          idempotency_key: string
          last_error: string | null
          next_retry_at: string | null
          payload: Json
          provider_id: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "outbox"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      outbox_enqueue: {
        Args: {
          p_action: string
          p_approval_id?: string
          p_channel: string
          p_idempotency_key: string
          p_payload: Json
        }
        Returns: string
      }
      outbox_mark_failed: {
        Args: { p_error: string; p_id: string; p_next_retry_at?: string }
        Returns: undefined
      }
      outbox_mark_sent: {
        Args: { p_id: string; p_provider_id?: string }
        Returns: undefined
      }
      p1_schedule_tour_atomic: {
        Args: {
          p_apartment_id: string
          p_email: string
          p_idempotency_key: string
          p_lead_metadata: Json
          p_neighborhood_id: string
          p_notes: string
          p_phone: string
          p_renter_notes: string
          p_scheduled_at: string
          p_showing_metadata: Json
          p_source: string
          p_user_id: string
        }
        Returns: Json
      }
      p1_start_rental_application_atomic: {
        Args: {
          p_apartment_id: string
          p_application_metadata: Json
          p_idempotency_key: string
          p_lead_metadata: Json
          p_neighborhood_id: string
          p_notes: string
          p_source: string
          p_user_id: string
        }
        Returns: Json
      }
      partner_ids_for_user: { Args: never; Returns: string[] }
      partner_organization_ids_for_user: { Args: never; Returns: string[] }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      record_check_in: {
        Args: {
          p_attendee_id: string
          p_details: Json
          p_event_id: string
          p_ip_address: unknown
          p_qr_token: string
          p_result: string
          p_scanned_by: string
          p_scanner_device: string
        }
        Returns: string
      }
      redeem_promo_code: {
        Args: { p_code: string; p_event_id: string; p_ticket_id: string }
        Returns: Json
      }
      release_stale_agent_job_locks: {
        Args: { p_stale_threshold?: string }
        Returns: number
      }
      request_approval: {
        Args: {
          p_action_type: string
          p_agent: string
          p_expires_hours?: number
          p_outbox_id?: string
          p_payload: Json
          p_requested_by?: string
          p_risk_level?: string
          p_subject: string
        }
        Returns: string
      }
      semantic_search_events: {
        Args: {
          match_count?: number
          query_embedding: string
          similarity_threshold?: number
        }
        Returns: {
          address: string
          description: string
          event_start_time: string
          event_type: string
          id: string
          name: string
          primary_image_url: string
          rating: number
          similarity: number
          tags: string[]
          ticket_price_min: number
        }[]
      }
      semantic_search_listings: {
        Args: {
          match_count?: number
          query_embedding: string
          similarity_threshold?: number
        }
        Returns: {
          amenities: string[]
          bathrooms: number
          bedrooms: number
          city: string
          description: string
          furnished: boolean
          id: string
          images: string[]
          neighborhood: string
          pet_friendly: boolean
          price_monthly: number
          rating: number
          similarity: number
          status: string
          title: string
        }[]
      }
      semantic_search_restaurants: {
        Args: {
          match_count?: number
          query_embedding: string
          similarity_threshold?: number
        }
        Returns: {
          address: string
          ambiance: string[]
          city: string
          cuisine_types: string[]
          description: string
          dietary_options: string[]
          id: string
          name: string
          price_level: number
          primary_image_url: string
          rating: number
          similarity: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      snapshot_analytics_events_daily: {
        Args: { target_date: string }
        Returns: {
          landlord_id: string
          leads_received: number
          snapshotted_date: string
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      ticket_checkout_cancel: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      ticket_checkout_create_pending: {
        Args: {
          p_access_token: string
          p_attendees: Json
          p_buyer_email: string
          p_buyer_name: string
          p_event_id: string
          p_quantity: number
          p_ticket_id: string
        }
        Returns: Json
      }
      ticket_payment_finalize: {
        Args: { p_order_id: string; p_payment_intent_id: string }
        Returns: Json
      }
      ticket_payment_finalize_response: {
        Args: {
          v_event: Database["public"]["Tables"]["events"]["Row"]
          v_order: Database["public"]["Tables"]["event_orders"]["Row"]
          v_ticket: Database["public"]["Tables"]["event_tickets"]["Row"]
        }
        Returns: Json
      }
      ticket_payment_refund: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      ticket_payment_refund_v2: {
        Args: {
          p_amount_cents: number
          p_attendee_ids: string[]
          p_initiated_by: string
          p_initiated_via: string
          p_order_id: string
          p_reason: string
          p_stripe_refund_id: string
        }
        Returns: string
      }
      ticket_validate_consume: { Args: { p_qr_token: string }; Returns: Json }
      unlockrows: { Args: { "": string }; Returns: number }
      update_agent_job_progress: {
        Args: { p_current_step?: string; p_job_id: string; p_progress: number }
        Returns: boolean
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      agent_type:
        | "local_scout"
        | "dining_orchestrator"
        | "event_curator"
        | "itinerary_optimizer"
        | "budget_guardian"
        | "booking_assistant"
        | "general_concierge"
        | "concierge"
        | "mia"
        | "luna"
        | "carlos"
        | "alex"
        | "diego"
        | "roberto"
        | "sponsor"
      ai_run_status:
        | "pending"
        | "running"
        | "success"
        | "error"
        | "timeout"
        | "cancelled"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      booking_type:
        | "apartment"
        | "car"
        | "restaurant"
        | "event"
        | "tour"
        | "showing"
      conflict_type:
        | "time_overlap"
        | "budget_exceeded"
        | "location_distance"
        | "booking_unavailable"
        | "preference_mismatch"
        | "weather_issue"
        | "capacity_issue"
      conversation_status: "active" | "archived" | "completed" | "abandoned"
      message_role: "user" | "assistant" | "system" | "function"
      partner_status:
        | "draft"
        | "pending_review"
        | "active"
        | "suspended"
        | "churned"
      partner_type:
        | "host"
        | "venue"
        | "broker"
        | "sponsor"
        | "agency"
        | "vendor"
        | "tour"
        | "creator"
      payment_status: "pending" | "paid" | "refunded" | "failed"
      resolution_status:
        | "detected"
        | "pending_review"
        | "auto_resolved"
        | "user_resolved"
        | "ignored"
      user_role: "user" | "moderator" | "admin" | "super_admin"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: [
        "local_scout",
        "dining_orchestrator",
        "event_curator",
        "itinerary_optimizer",
        "budget_guardian",
        "booking_assistant",
        "general_concierge",
        "concierge",
        "mia",
        "luna",
        "carlos",
        "alex",
        "diego",
        "roberto",
        "sponsor",
      ],
      ai_run_status: [
        "pending",
        "running",
        "success",
        "error",
        "timeout",
        "cancelled",
      ],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      booking_type: [
        "apartment",
        "car",
        "restaurant",
        "event",
        "tour",
        "showing",
      ],
      conflict_type: [
        "time_overlap",
        "budget_exceeded",
        "location_distance",
        "booking_unavailable",
        "preference_mismatch",
        "weather_issue",
        "capacity_issue",
      ],
      conversation_status: ["active", "archived", "completed", "abandoned"],
      message_role: ["user", "assistant", "system", "function"],
      partner_status: [
        "draft",
        "pending_review",
        "active",
        "suspended",
        "churned",
      ],
      partner_type: [
        "host",
        "venue",
        "broker",
        "sponsor",
        "agency",
        "vendor",
        "tour",
        "creator",
      ],
      payment_status: ["pending", "paid", "refunded", "failed"],
      resolution_status: [
        "detected",
        "pending_review",
        "auto_resolved",
        "user_resolved",
        "ignored",
      ],
      user_role: ["user", "moderator", "admin", "super_admin"],
    },
  },
} as const
