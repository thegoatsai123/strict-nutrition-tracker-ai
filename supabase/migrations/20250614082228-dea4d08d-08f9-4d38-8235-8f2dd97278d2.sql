
-- Create meal plans table for weekly meal planning
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal plan items table to store recipes for each day
CREATE TABLE public.meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6) NOT NULL, -- 0=Sunday, 6=Saturday
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  recipe_id INTEGER, -- Spoonacular recipe ID
  recipe_title TEXT NOT NULL,
  recipe_calories INTEGER,
  recipe_servings INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create water intake tracking table
CREATE TABLE public.water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 0,
  goal_ml INTEGER DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create nutrition goals table for custom daily targets
CREATE TABLE public.nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'custom')) NOT NULL,
  target_weight DECIMAL(5,2), -- in kg
  target_date DATE,
  daily_calories INTEGER NOT NULL,
  daily_protein INTEGER NOT NULL,
  daily_carbs INTEGER NOT NULL,
  daily_fat INTEGER NOT NULL,
  daily_fiber INTEGER DEFAULT 25,
  daily_sugar_limit INTEGER DEFAULT 50,
  daily_sodium_limit INTEGER DEFAULT 2300, -- mg
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise tracking table
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'sports', 'other')) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER,
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high', 'vigorous')),
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food favorites/bookmarks table
CREATE TABLE public.food_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fdc_id INTEGER NOT NULL,
  food_description TEXT NOT NULL,
  brand_owner TEXT,
  common_serving_size DECIMAL(8,2),
  common_serving_unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, fdc_id)
);

-- Create user achievements table for gamification
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT CHECK (achievement_type IN ('logging_streak', 'weight_milestone', 'exercise_goal', 'water_goal', 'protein_goal', 'custom')) NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  points_earned INTEGER DEFAULT 0,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_milestone BOOLEAN DEFAULT false
);

-- Create shopping lists table
CREATE TABLE public.shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Shopping List',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shopping list items table
CREATE TABLE public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id UUID REFERENCES public.shopping_lists(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  quantity DECIMAL(8,2) DEFAULT 1,
  unit TEXT DEFAULT 'item',
  category TEXT, -- e.g., 'produce', 'dairy', 'meat'
  is_purchased BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meal_plans
CREATE POLICY "Users can view their own meal plans" ON public.meal_plans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own meal plans" ON public.meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meal plans" ON public.meal_plans
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meal plans" ON public.meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meal_plan_items
CREATE POLICY "Users can view their own meal plan items" ON public.meal_plan_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create their own meal plan items" ON public.meal_plan_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update their own meal plan items" ON public.meal_plan_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own meal plan items" ON public.meal_plan_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.meal_plans WHERE id = meal_plan_id AND user_id = auth.uid())
  );

-- Create RLS policies for water_intake
CREATE POLICY "Users can view their own water intake" ON public.water_intake
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own water intake" ON public.water_intake
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own water intake" ON public.water_intake
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for nutrition_goals
CREATE POLICY "Users can view their own nutrition goals" ON public.nutrition_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutrition goals" ON public.nutrition_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition goals" ON public.nutrition_goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition goals" ON public.nutrition_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercises
CREATE POLICY "Users can view their own exercises" ON public.exercises
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exercises" ON public.exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercises" ON public.exercises
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercises" ON public.exercises
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for food_favorites
CREATE POLICY "Users can view their own food favorites" ON public.food_favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own food favorites" ON public.food_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own food favorites" ON public.food_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for shopping_lists
CREATE POLICY "Users can view their own shopping lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own shopping lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own shopping lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own shopping lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shopping_list_items
CREATE POLICY "Users can view their own shopping list items" ON public.shopping_list_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shopping_lists WHERE id = shopping_list_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create their own shopping list items" ON public.shopping_list_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shopping_lists WHERE id = shopping_list_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can update their own shopping list items" ON public.shopping_list_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shopping_lists WHERE id = shopping_list_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own shopping list items" ON public.shopping_list_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.shopping_lists WHERE id = shopping_list_id AND user_id = auth.uid())
  );

-- Create function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_water_intake_updated_at BEFORE UPDATE ON public.water_intake
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_nutrition_goals_updated_at BEFORE UPDATE ON public.nutrition_goals
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON public.shopping_lists
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_meal_plans_user_id_active ON public.meal_plans(user_id, is_active);
CREATE INDEX idx_meal_plan_items_plan_id ON public.meal_plan_items(meal_plan_id);
CREATE INDEX idx_water_intake_user_date ON public.water_intake(user_id, date);
CREATE INDEX idx_nutrition_goals_user_active ON public.nutrition_goals(user_id, is_active);
CREATE INDEX idx_exercises_user_date ON public.exercises(user_id, date);
CREATE INDEX idx_food_favorites_user_id ON public.food_favorites(user_id);
CREATE INDEX idx_user_achievements_user_type ON public.user_achievements(user_id, achievement_type);
CREATE INDEX idx_shopping_lists_user_id ON public.shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list_id ON public.shopping_list_items(shopping_list_id);
