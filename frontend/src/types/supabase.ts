// This is a placeholder for the database types
// In a real setup, you would generate these types using the Supabase CLI with:
// supabase gen types typescript --project-id your-project-id > src/types/supabase.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          current_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          current_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          current_level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_items: {
        Row: {
          id: string;
          brick_type: string;
          domain: string | null;
          topic_hierarchy: string | null;
          intrinsic_difficulty: number | null;
          content: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brick_type: string;
          domain?: string | null;
          topic_hierarchy?: string | null;
          intrinsic_difficulty?: number | null;
          content?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brick_type?: string;
          domain?: string | null;
          topic_hierarchy?: string | null;
          intrinsic_difficulty?: number | null;
          content?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_knowledge_states: {
        Row: {
          user_id: string;
          content_id: string;
          mastery_estimate: number;
          memory_strength: number;
          exposure_count: number;
          correct_count: number;
          last_interaction_at: string;
          next_review_due_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content_id: string;
          mastery_estimate?: number;
          memory_strength?: number;
          exposure_count?: number;
          correct_count?: number;
          last_interaction_at?: string;
          next_review_due_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          content_id?: string;
          mastery_estimate?: number;
          memory_strength?: number;
          exposure_count?: number;
          correct_count?: number;
          last_interaction_at?: string;
          next_review_due_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
  auth: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          // Add other auth.users fields as needed
        };
        Insert: {
          id: string;
          email: string;
          // Add other auth.users fields as needed
        };
        Update: {
          id?: string;
          email?: string;
          // Add other auth.users fields as needed
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}; 