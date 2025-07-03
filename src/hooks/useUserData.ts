
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserNutritionData {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  dailyGoalProgress: number;
  weeklyStreak: number;
  monthlyAverage: number;
}

export const useUserData = () => {
  const [nutritionData, setNutritionData] = useState<UserNutritionData>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    dailyGoalProgress: 0,
    weeklyStreak: 0,
    monthlyAverage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadUserNutritionData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Load today's nutrition data
      const { data: todayLogs, error: todayError } = await supabase
        .from('food_logs')
        .select('calories, protein, carbohydrates, fat')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`);

      if (todayError) throw todayError;

      // Calculate today's totals
      const todayTotals = todayLogs?.reduce((acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbohydrates) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

      // Load user's daily calorie goal
      const { data: goals } = await supabase
        .from('nutrition_goals')
        .select('daily_calories')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      const dailyCalorieGoal = goals?.[0]?.daily_calories || 2000;
      const goalProgress = Math.min(100, Math.round((todayTotals.calories / dailyCalorieGoal) * 100));

      // Calculate weekly streak
      const { data: weeklyLogs } = await supabase
        .from('food_logs')
        .select('consumed_at')
        .eq('user_id', user.id)
        .gte('consumed_at', `${oneWeekAgo}T00:00:00`);

      const uniqueWeeklyDays = new Set(weeklyLogs?.map(log => log.consumed_at.split('T')[0]) || []);
      const weeklyStreak = uniqueWeeklyDays.size;

      // Calculate monthly average
      const { data: monthlyLogs } = await supabase
        .from('food_logs')
        .select('calories')
        .eq('user_id', user.id)
        .gte('consumed_at', `${oneMonthAgo}T00:00:00`);

      const monthlyAverage = monthlyLogs?.length 
        ? Math.round(monthlyLogs.reduce((sum, log) => sum + (Number(log.calories) || 0), 0) / monthlyLogs.length)
        : 0;

      setNutritionData({
        totalCalories: todayTotals.calories,
        totalProtein: todayTotals.protein,
        totalCarbs: todayTotals.carbs,
        totalFat: todayTotals.fat,
        dailyGoalProgress: goalProgress,
        weeklyStreak,
        monthlyAverage
      });

      setError(null);
    } catch (err) {
      console.error('Error loading user nutrition data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load nutrition data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserNutritionData();

    // Listen for real-time updates
    const handleUpdate = () => loadUserNutritionData();
    window.addEventListener('food-logs-updated', handleUpdate);
    window.addEventListener('nutrition-goals-updated', handleUpdate);

    return () => {
      window.removeEventListener('food-logs-updated', handleUpdate);
      window.removeEventListener('nutrition-goals-updated', handleUpdate);
    };
  }, [user]);

  return {
    nutritionData,
    isLoading,
    error,
    refreshData: loadUserNutritionData
  };
};
