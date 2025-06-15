
import React, { useState, useEffect } from 'react';
import { NutritionProgress } from './NutritionProgress';
import { StreakCounter } from './StreakCounter';
import { HydrationReminder } from './HydrationReminder';
import { RealTimeDashboard } from '../RealTimeDashboard/RealTimeDashboard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-states';

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

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load nutrition data
      const { data: foodLogs } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`);

      // Load nutrition goals
      const { data: goals } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      // Load water intake
      const { data: waterData } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      // Calculate nutrition totals
      const nutritionTotals = foodLogs?.reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbohydrates || 0),
        fat: acc.fat + (log.fat || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

      // Calculate streaks (simplified - you might want to make this more sophisticated)
      const { data: recentLogs } = await supabase
        .from('food_logs')
        .select('consumed_at')
        .eq('user_id', user.id)
        .gte('consumed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('consumed_at', { ascending: false });

      const streakData = calculateStreak(recentLogs);

      setDashboardData({
        nutrition: {
          calories: { current: nutritionTotals.calories, goal: goals?.daily_calories || 2000 },
          protein: { current: nutritionTotals.protein, goal: goals?.daily_protein || 150 },
          carbs: { current: nutritionTotals.carbs, goal: goals?.daily_carbs || 250 },
          fat: { current: nutritionTotals.fat, goal: goals?.daily_fat || 65 },
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
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (logs: any[] | null) => {
    if (!logs || logs.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Simple streak calculation - count consecutive days with logs
    const dates = [...new Set(logs.map(log => log.consumed_at.split('T')[0]))];
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split('T')[0];
    if (dates.includes(today)) {
      currentStreak = 1;
    }

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
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
      await supabase
        .from('water_intake')
        .upsert({
          user_id: user.id,
          date: today,
          amount_ml: newAmount,
          goal_ml: dashboardData.water.goal,
        });

      setDashboardData({
        ...dashboardData,
        water: {
          ...dashboardData.water,
          current: newAmount,
          lastIntake: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating water intake:', error);
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
        Failed to load dashboard data
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
