
import React, { useState, useEffect } from 'react';
import { NutritionProgress } from './NutritionProgress';
import { StreakCounter } from './StreakCounter';
import { HydrationReminder } from './HydrationReminder';
import { RealTimeDashboard } from '../RealTimeDashboard/RealTimeDashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { useToast } from '@/hooks/use-toast';

interface DashboardData {
  nutrition: {
    calories: { current: number; goal: number };
    protein: { current: number; goal: number };
    carbs: { current: number; goal: number };
    fat: { current: number; goal: number };
  };
  water: {
    current: number;
    goal: number;
    lastIntake?: Date;
  };
  streaks: {
    current: number;
    longest: number;
    lastActivity?: Date;
  };
}

export const EnhancedDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load nutrition data for today
      const { data: foodLogs, error: foodError } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`);

      if (foodError) {
        console.error('Error loading food logs:', foodError);
      }

      // Load user's nutrition goals
      const { data: goals, error: goalsError } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (goalsError) {
        console.error('Error loading nutrition goals:', goalsError);
      }

      // Load water intake for today
      const { data: waterData, error: waterError } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (waterError && waterError.code !== 'PGRST116') {
        console.error('Error loading water data:', waterError);
      }

      // Calculate nutrition totals from actual food logs
      const nutritionTotals = foodLogs?.reduce((acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbohydrates) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

      // Get user's profile for default goals
      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_calories, protein_goal, carbs_goal, fat_goal')
        .eq('id', user.id)
        .single();

      // Use goals from nutrition_goals table or profile, with fallback defaults
      const currentGoals = goals?.[0] || {};
      const defaultGoals = {
        calories: currentGoals.daily_calories || profile?.daily_calories || 2000,
        protein: currentGoals.daily_protein || profile?.protein_goal || 150,
        carbs: currentGoals.daily_carbs || profile?.carbs_goal || 250,
        fat: currentGoals.daily_fat || profile?.fat_goal || 65,
      };

      // Calculate streaks from actual data
      const { data: recentLogs } = await supabase
        .from('food_logs')
        .select('consumed_at')
        .eq('user_id', user.id)
        .gte('consumed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('consumed_at', { ascending: false });

      const streakData = calculateStreakFromLogs(recentLogs || []);

      setDashboardData({
        nutrition: {
          calories: { current: nutritionTotals.calories, goal: defaultGoals.calories },
          protein: { current: nutritionTotals.protein, goal: defaultGoals.protein },
          carbs: { current: nutritionTotals.carbs, goal: defaultGoals.carbs },
          fat: { current: nutritionTotals.fat, goal: defaultGoals.fat },
        },
        water: {
          current: waterData?.amount_ml || 0,
          goal: waterData?.goal_ml || 2000,
          lastIntake: waterData?.updated_at ? new Date(waterData.updated_at) : undefined,
        },
        streaks: streakData,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Could not load dashboard data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreakFromLogs = (logs: any[]) => {
    if (!logs || logs.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Get unique dates from logs
    const dates = [...new Set(logs.map(log => log.consumed_at.split('T')[0]))].sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if user logged food today
    if (dates.includes(today)) {
      currentStreak = 1;
      tempStreak = 1;
    }

    // Calculate consecutive days
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i - 1]);
      const nextDate = new Date(dates[i]);
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        if (i === 1) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current: currentStreak,
      longest: longestStreak,
      lastActivity: logs.length > 0 ? new Date(logs[0].consumed_at) : undefined,
    };
  };

  const handleAddWater = async (amount: number) => {
    if (!user || !dashboardData) return;

    const today = new Date().toISOString().split('T')[0];
    const newAmount = dashboardData.water.current + amount;

    try {
      const { error } = await supabase
        .from('water_intake')
        .upsert({
          user_id: user.id,
          date: today,
          amount_ml: newAmount,
          goal_ml: dashboardData.water.goal,
        });

      if (error) throw error;

      setDashboardData({
        ...dashboardData,
        water: {
          ...dashboardData.water,
          current: newAmount,
          lastIntake: new Date(),
        },
      });

      toast({
        title: "Water Logged! 💧",
        description: `Added ${amount}ml to your daily intake.`
      });

      // Trigger real-time update
      window.dispatchEvent(new CustomEvent('water-intake-updated'));
    } catch (error) {
      console.error('Error updating water intake:', error);
      toast({
        title: "Error",
        description: "Failed to log water intake. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Listen for real-time updates
    const handleUpdate = () => loadDashboardData();
    window.addEventListener('food-logs-updated', handleUpdate);
    window.addEventListener('water-intake-updated', handleUpdate);

    return () => {
      window.removeEventListener('food-logs-updated', handleUpdate);
      window.removeEventListener('water-intake-updated', handleUpdate);
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>No data available. Start logging your meals to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Nutrition Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NutritionProgress
          current={dashboardData.nutrition.calories.current}
          goal={dashboardData.nutrition.calories.goal}
          label="Calories"
          unit="kcal"
          type="calories"
          color="hsl(var(--primary))"
          isGoalMet={dashboardData.nutrition.calories.current >= dashboardData.nutrition.calories.goal}
        />
        <NutritionProgress
          current={dashboardData.nutrition.protein.current}
          goal={dashboardData.nutrition.protein.goal}
          label="Protein"
          unit="g"
          type="protein"
          color="hsl(142, 76%, 36%)"
          isGoalMet={dashboardData.nutrition.protein.current >= dashboardData.nutrition.protein.goal}
        />
        <NutritionProgress
          current={dashboardData.nutrition.carbs.current}
          goal={dashboardData.nutrition.carbs.goal}
          label="Carbs"
          unit="g"
          type="carbs"
          color="hsl(45, 93%, 47%)"
          isGoalMet={dashboardData.nutrition.carbs.current >= dashboardData.nutrition.carbs.goal}
        />
        <NutritionProgress
          current={dashboardData.nutrition.fat.current}
          goal={dashboardData.nutrition.fat.goal}
          label="Fat"
          unit="g"
          type="fat"
          color="hsl(21, 90%, 48%)"
          isGoalMet={dashboardData.nutrition.fat.current >= dashboardData.nutrition.fat.goal}
        />
      </div>

      {/* Streak Counter and Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakCounter
          currentStreak={dashboardData.streaks.current}
          longestStreak={dashboardData.streaks.longest}
          streakType="daily"
          goal="Log meals daily"
          lastActivity={dashboardData.streaks.lastActivity}
        />
        <HydrationReminder
          currentIntake={dashboardData.water.current}
          dailyGoal={dashboardData.water.goal}
          lastIntakeTime={dashboardData.water.lastIntake}
          onAddWater={handleAddWater}
        />
      </div>

      {/* Original Real-time Dashboard */}
      <RealTimeDashboard />
    </div>
  );
};
