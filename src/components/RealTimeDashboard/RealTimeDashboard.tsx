
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { Activity, Droplets, Target, TrendingUp } from 'lucide-react';

interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface NutritionGoals {
  daily_calories: number;
  daily_protein: number;
  daily_carbs: number;
  daily_fat: number;
  daily_fiber: number;
  daily_sugar_limit: number;
  daily_sodium_limit: number;
}

export const RealTimeDashboard = () => {
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { isConnected } = useRealTimeUpdates();

  const loadDailyNutrition = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Load food logs for today
      const { data: foodLogs, error: foodError } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('consumed_at', `${today}T00:00:00`)
        .lt('consumed_at', `${today}T23:59:59`);

      if (foodError) throw foodError;

      // Calculate totals
      const totals = foodLogs?.reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbohydrates || 0),
        fat: acc.fat + (log.fat || 0),
        fiber: acc.fiber + (log.fiber || 0),
        sugar: acc.sugar + (log.sugar || 0),
        sodium: acc.sodium + (log.sodium || 0)
      }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      }) || dailyNutrition;

      setDailyNutrition(totals);

      // Load nutrition goals
      const { data: goalData, error: goalError } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (!goalError && goalData) {
        setGoals(goalData);
      }

      // Load water intake
      const { data: waterData, error: waterError } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (!waterError && waterData) {
        setWaterIntake(waterData.amount_ml);
        setWaterGoal(waterData.goal_ml);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDailyNutrition();

    // Listen for real-time updates
    const handleFoodLogsUpdate = () => loadDailyNutrition();
    const handleWaterUpdate = () => loadDailyNutrition();

    window.addEventListener('food-logs-updated', handleFoodLogsUpdate);
    window.addEventListener('water-intake-updated', handleWaterUpdate);

    return () => {
      window.removeEventListener('food-logs-updated', handleFoodLogsUpdate);
      window.removeEventListener('water-intake-updated', handleWaterUpdate);
    };
  }, [user]);

  if (isLoading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {isConnected ? 'Real-time updates active' : 'Connecting...'}
        </span>
      </div>

      {/* Main Nutrition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyNutrition.calories)}</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.daily_calories || 2000} goal
            </p>
            <Progress 
              value={getProgressPercentage(dailyNutrition.calories, goals?.daily_calories || 2000)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyNutrition.protein)}g</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.daily_protein || 150}g goal
            </p>
            <Progress 
              value={getProgressPercentage(dailyNutrition.protein, goals?.daily_protein || 150)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(dailyNutrition.carbs)}g</div>
            <p className="text-xs text-muted-foreground">
              of {goals?.daily_carbs || 250}g goal
            </p>
            <Progress 
              value={getProgressPercentage(dailyNutrition.carbs, goals?.daily_carbs || 250)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waterIntake}ml</div>
            <p className="text-xs text-muted-foreground">
              of {waterGoal}ml goal
            </p>
            <Progress 
              value={getProgressPercentage(waterIntake, waterGoal)} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Nutrition Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.round(dailyNutrition.fat)}g</div>
              <div className="text-sm text-gray-600">Fat</div>
              <Badge variant={dailyNutrition.fat <= (goals?.daily_fat || 65) ? 'default' : 'destructive'}>
                {goals?.daily_fat ? `${Math.round((dailyNutrition.fat / goals.daily_fat) * 100)}%` : 'No goal'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.round(dailyNutrition.fiber)}g</div>
              <div className="text-sm text-gray-600">Fiber</div>
              <Badge variant={dailyNutrition.fiber >= (goals?.daily_fiber || 25) ? 'default' : 'secondary'}>
                {goals?.daily_fiber ? `${Math.round((dailyNutrition.fiber / goals.daily_fiber) * 100)}%` : 'No goal'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.round(dailyNutrition.sugar)}g</div>
              <div className="text-sm text-gray-600">Sugar</div>
              <Badge variant={dailyNutrition.sugar <= (goals?.daily_sugar_limit || 50) ? 'default' : 'destructive'}>
                {goals?.daily_sugar_limit ? `${Math.round((dailyNutrition.sugar / goals.daily_sugar_limit) * 100)}%` : 'No limit'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.round(dailyNutrition.sodium)}mg</div>
              <div className="text-sm text-gray-600">Sodium</div>
              <Badge variant={dailyNutrition.sodium <= (goals?.daily_sodium_limit || 2300) ? 'default' : 'destructive'}>
                {goals?.daily_sodium_limit ? `${Math.round((dailyNutrition.sodium / goals.daily_sodium_limit) * 100)}%` : 'No limit'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
