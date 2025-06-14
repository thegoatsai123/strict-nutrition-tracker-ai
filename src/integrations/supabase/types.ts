export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          date: string
          duration_minutes: number
          exercise_name: string
          exercise_type: string
          id: string
          intensity: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          date: string
          duration_minutes: number
          exercise_name: string
          exercise_type: string
          id?: string
          intensity?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_minutes?: number
          exercise_name?: string
          exercise_type?: string
          id?: string
          intensity?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_favorites: {
        Row: {
          brand_owner: string | null
          common_serving_size: number | null
          common_serving_unit: string | null
          created_at: string | null
          fdc_id: number
          food_description: string
          id: string
          user_id: string
        }
        Insert: {
          brand_owner?: string | null
          common_serving_size?: number | null
          common_serving_unit?: string | null
          created_at?: string | null
          fdc_id: number
          food_description: string
          id?: string
          user_id: string
        }
        Update: {
          brand_owner?: string | null
          common_serving_size?: number | null
          common_serving_unit?: string | null
          created_at?: string | null
          fdc_id?: number
          food_description?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          brand_owner: string | null
          calories: number | null
          carbohydrates: number | null
          consumed_at: string
          created_at: string | null
          fat: number | null
          fdc_id: number
          fiber: number | null
          food_description: string
          id: string
          meal_type: string
          protein: number | null
          quantity: number
          sodium: number | null
          sugar: number | null
          unit: string
          user_id: string
        }
        Insert: {
          brand_owner?: string | null
          calories?: number | null
          carbohydrates?: number | null
          consumed_at: string
          created_at?: string | null
          fat?: number | null
          fdc_id: number
          fiber?: number | null
          food_description: string
          id?: string
          meal_type: string
          protein?: number | null
          quantity: number
          sodium?: number | null
          sugar?: number | null
          unit: string
          user_id: string
        }
        Update: {
          brand_owner?: string | null
          calories?: number | null
          carbohydrates?: number | null
          consumed_at?: string
          created_at?: string | null
          fat?: number | null
          fdc_id?: number
          fiber?: number | null
          food_description?: string
          id?: string
          meal_type?: string
          protein?: number | null
          quantity?: number
          sodium?: number | null
          sugar?: number | null
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_plan_items: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          meal_plan_id: string
          meal_type: string
          recipe_calories: number | null
          recipe_id: number | null
          recipe_servings: number | null
          recipe_title: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          meal_plan_id: string
          meal_type: string
          recipe_calories?: number | null
          recipe_id?: number | null
          recipe_servings?: number | null
          recipe_title: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          meal_plan_id?: string
          meal_type?: string
          recipe_calories?: number | null
          recipe_id?: number | null
          recipe_servings?: number | null
          recipe_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nutrition_goals: {
        Row: {
          created_at: string | null
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_fiber: number | null
          daily_protein: number
          daily_sodium_limit: number | null
          daily_sugar_limit: number | null
          goal_type: string
          id: string
          is_active: boolean | null
          target_date: string | null
          target_weight: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_fiber?: number | null
          daily_protein: number
          daily_sodium_limit?: number | null
          daily_sugar_limit?: number | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_fiber?: number | null
          daily_protein?: number
          daily_sodium_limit?: number | null
          daily_sugar_limit?: number | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_weight?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[] | null
          carbs_goal: number | null
          created_at: string | null
          daily_calories: number | null
          diet_type: string | null
          disliked_ingredients: string[] | null
          email: string
          fat_goal: number | null
          gender: string | null
          height: number | null
          id: string
          name: string
          protein_goal: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          carbs_goal?: number | null
          created_at?: string | null
          daily_calories?: number | null
          diet_type?: string | null
          disliked_ingredients?: string[] | null
          email: string
          fat_goal?: number | null
          gender?: string | null
          height?: number | null
          id: string
          name: string
          protein_goal?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[] | null
          carbs_goal?: number | null
          created_at?: string | null
          daily_calories?: number | null
          diet_type?: string | null
          disliked_ingredients?: string[] | null
          email?: string
          fat_goal?: number | null
          gender?: string | null
          height?: number | null
          id?: string
          name?: string
          protein_goal?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          health_score: number | null
          id: string
          image: string | null
          ready_in_minutes: number | null
          saved_at: string | null
          servings: number | null
          spoonacular_id: number
          title: string
          user_id: string
        }
        Insert: {
          health_score?: number | null
          id?: string
          image?: string | null
          ready_in_minutes?: number | null
          saved_at?: string | null
          servings?: number | null
          spoonacular_id: number
          title: string
          user_id: string
        }
        Update: {
          health_score?: number | null
          id?: string
          image?: string | null
          ready_in_minutes?: number | null
          saved_at?: string | null
          servings?: number | null
          spoonacular_id?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_purchased: boolean | null
          item_name: string
          notes: string | null
          quantity: number | null
          shopping_list_id: string
          unit: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_purchased?: boolean | null
          item_name: string
          notes?: string | null
          quantity?: number | null
          shopping_list_id: string
          unit?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_purchased?: boolean | null
          item_name?: string
          notes?: string | null
          quantity?: number | null
          shopping_list_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string | null
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          id: string
          is_milestone: boolean | null
          points_earned: number | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          id?: string
          is_milestone?: boolean | null
          points_earned?: number | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          id?: string
          is_milestone?: boolean | null
          points_earned?: number | null
          user_id?: string
        }
        Relationships: []
      }
      water_intake: {
        Row: {
          amount_ml: number
          created_at: string | null
          date: string
          goal_ml: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_ml?: number
          created_at?: string | null
          date: string
          goal_ml?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          date?: string
          goal_ml?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
