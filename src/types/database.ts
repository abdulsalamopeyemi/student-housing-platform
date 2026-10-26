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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      accommodation_payments: {
        Row: {
          access_code: string | null
          amount_kobo: number
          channel: string | null
          checkout_url: string | null
          created_at: string
          currency: string
          gateway_response: string | null
          gateway_transaction_id: number | null
          id: string
          inspection_request_id: string
          paid_at: string | null
          processor: string
          property_id: string
          provider_id: string
          reference: string
          room_type_id: string
          status: string
          student_user_id: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          access_code?: string | null
          amount_kobo: number
          channel?: string | null
          checkout_url?: string | null
          created_at?: string
          currency?: string
          gateway_response?: string | null
          gateway_transaction_id?: number | null
          id?: string
          inspection_request_id: string
          paid_at?: string | null
          processor?: string
          property_id: string
          provider_id: string
          reference: string
          room_type_id: string
          status?: string
          student_user_id: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          access_code?: string | null
          amount_kobo?: number
          channel?: string | null
          checkout_url?: string | null
          created_at?: string
          currency?: string
          gateway_response?: string | null
          gateway_transaction_id?: number | null
          id?: string
          inspection_request_id?: string
          paid_at?: string | null
          processor?: string
          property_id?: string
          provider_id?: string
          reference?: string
          room_type_id?: string
          status?: string
          student_user_id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_payments_inspection_request_id_fkey"
            columns: ["inspection_request_id"]
            isOneToOne: false
            referencedRelation: "inspection_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_payments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_payments_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          category: string
          id: string
          name: string
        }
        Insert: {
          category?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      inspection_requests: {
        Row: {
          contact_phone: string
          created_at: string
          id: string
          note: string | null
          occupant_group_size: string
          preferred_date: string
          property_id: string
          room_type_id: string | null
          status: Database["public"]["Enums"]["inspection_status"]
          student_user_id: string
          updated_at: string
        }
        Insert: {
          contact_phone: string
          created_at?: string
          id?: string
          note?: string | null
          occupant_group_size?: string
          preferred_date: string
          property_id: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["inspection_status"]
          student_user_id: string
          updated_at?: string
        }
        Update: {
          contact_phone?: string
          created_at?: string
          id?: string
          note?: string | null
          occupant_group_size?: string
          preferred_date?: string
          property_id?: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["inspection_status"]
          student_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_requests_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          university_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          area: string
          created_at: string
          description: string
          distance_label: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          provider_id: string
          publication_status: Database["public"]["Enums"]["publication_status"]
          published_at: string | null
          slug: string
          university_id: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          area: string
          created_at?: string
          description?: string
          distance_label?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          provider_id: string
          publication_status?: Database["public"]["Enums"]["publication_status"]
          published_at?: string | null
          slug: string
          university_id: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          area?: string
          created_at?: string
          description?: string
          distance_label?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          provider_id?: string
          publication_status?: Database["public"]["Enums"]["publication_status"]
          published_at?: string | null
          slug?: string
          university_id?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "properties_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      property_agent_assignments: {
        Row: {
          agent_provider_id: string
          assigned_by_provider_id: string
          created_at: string
          property_id: string
          updated_at: string
        }
        Insert: {
          agent_provider_id: string
          assigned_by_provider_id: string
          created_at?: string
          property_id: string
          updated_at?: string
        }
        Update: {
          agent_provider_id?: string
          assigned_by_provider_id?: string
          created_at?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_agent_assignments_agent_provider_id_fkey"
            columns: ["agent_provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_agent_assignments_assigned_by_provider_id_fkey"
            columns: ["assigned_by_provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_agent_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_fees: {
        Row: {
          amount: number
          created_at: string
          id: string
          label: string
          required: boolean
          room_type_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          label: string
          required?: boolean
          room_type_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          label?: string
          required?: boolean
          room_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_fees_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          property_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          id?: string
          property_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          property_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_payment_accounts: {
        Row: {
          created_at: string
          created_by_admin_user_id: string | null
          processor: string
          provider_id: string
          status: string
          subaccount_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_admin_user_id?: string | null
          processor?: string
          provider_id: string
          status?: string
          subaccount_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_admin_user_id?: string | null
          processor?: string
          provider_id?: string
          status?: string
          subaccount_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_payment_accounts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          profile_id: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          profile_id: string
          provider_type: Database["public"]["Enums"]["provider_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          profile_id?: string
          provider_type?: Database["public"]["Enums"]["provider_type"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "providers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          property_id: string
          reason: string
          reporter_user_id: string
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          property_id: string
          reason: string
          reporter_user_id: string
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          property_id?: string
          reason?: string
          reporter_user_id?: string
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          annual_rent: number
          availability_updated_at: string
          available_count: number
          capacity: number
          created_at: string
          id: string
          name: string
          property_id: string
          total_count: number
          updated_at: string
        }
        Insert: {
          annual_rent: number
          availability_updated_at?: string
          available_count?: number
          capacity?: number
          created_at?: string
          id?: string
          name: string
          property_id: string
          total_count?: number
          updated_at?: string
        }
        Update: {
          annual_rent?: number
          availability_updated_at?: string
          available_count?: number
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          property_id?: string
          total_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          property_id: string
          student_user_id: string
        }
        Insert: {
          created_at?: string
          property_id: string
          student_user_id: string
        }
        Update: {
          created_at?: string
          property_id?: string
          student_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          name: string
          ownership: string | null
          slug: string
          source_checked_at: string | null
          source_name: string | null
          state: string
          year_established: number | null
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          name: string
          ownership?: string | null
          slug: string
          source_checked_at?: string | null
          source_name?: string | null
          state: string
          year_established?: number | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          ownership?: string | null
          slug?: string
          source_checked_at?: string | null
          source_name?: string | null
          state?: string
          year_established?: number | null
        }
        Relationships: []
      }
      verification_events: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          notes: string | null
          property_id: string | null
          provider_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          provider_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          provider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_property_draft: {
        Args: {
          p_amenity_ids?: string[]
          p_annual_rent: number
          p_area: string
          p_available_count: number
          p_description: string
          p_distance_label: string
          p_fees?: Json
          p_name: string
          p_room_type_name: string
          p_slug: string
          p_total_count: number
          p_university_id: string
        }
        Returns: Json
      }
      update_property_draft: {
        Args: {
          p_amenity_ids?: string[]
          p_annual_rent: number
          p_area: string
          p_available_count: number
          p_description: string
          p_distance_label: string
          p_fees?: Json
          p_name: string
          p_property_id: string
          p_room_type_name: string
          p_total_count: number
          p_university_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "student" | "provider" | "admin"
      inspection_status:
        | "requested"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "declined"
      provider_type: "landlord" | "agent" | "property_manager"
      publication_status:
        | "draft"
        | "pending_review"
        | "published"
        | "rejected"
        | "archived"
      report_status: "open" | "reviewing" | "resolved" | "dismissed"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "provider", "admin"],
      inspection_status: [
        "requested",
        "confirmed",
        "completed",
        "cancelled",
        "declined",
      ],
      provider_type: ["landlord", "agent", "property_manager"],
      publication_status: [
        "draft",
        "pending_review",
        "published",
        "rejected",
        "archived",
      ],
      report_status: ["open", "reviewing", "resolved", "dismissed"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
