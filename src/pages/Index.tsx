
import React, { useState, useEffect } from "react";
import { EnhancedDashboard } from "@/components/Dashboard/EnhancedDashboard";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { WaterTracker } from "@/components/WaterTracker";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { QuickStats } from "@/components/Dashboard/QuickStats";
import { ActionButtons } from "@/components/Dashboard/ActionButtons";
import { useNotifications } from "@/hooks/useNotifications";
import { useChat } from "@/hooks/useChat";
import { NutritionCoach } from '@/components/Chat/NutritionCoach';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [currentNutrition, setCurrentNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [userGoals, setUserGoals] = useState<string[]>([]);
  
  const { permission, scheduleWaterReminder, scheduleMealReminder } = useNotifications();
  const { isChatMinimized, toggleChatMinimize } = useChat();
  const { user } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Load today's nutrition data
        const { data: foodLogs } = await supabase
          .from('food_logs')
          .select('calories, protein, carbohydrates, fat')
          .eq('user_id', user.id)
          .gte('consumed_at', `${today}T00:00:00`)
          .lt('consumed_at', `${today}T23:59:59`);

        if (foodLogs) {
          const totals = foodLogs.reduce((acc, log) => ({
            calories: acc.calories + (Number(log.calories) || 0),
            protein: acc.protein + (Number(log.protein) || 0),
            carbs: acc.carbs + (Number(log.carbohydrates) || 0),
            fat: acc.fat + (Number(log.fat) || 0),
          }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

          setCurrentNutrition(totals);
        }

        // Load user's goals
        const { data: goals } = await supabase
          .from('nutrition_goals')
          .select('goal_type, daily_calories')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (goals && goals.length > 0) {
          const goalTypes = goals.map(g => g.goal_type);
          setUserGoals(goalTypes);
          
          // Calculate progress percentage
          const totalCalorieGoal = goals.reduce((sum, goal) => sum + (goal.daily_calories || 0), 0);
          if (totalCalorieGoal > 0) {
            setDailyGoalProgress(Math.min(100, Math.round((currentNutrition.calories / (totalCalorieGoal / goals.length)) * 100)));
          }
        }

        // Calculate weekly streak
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: weeklyLogs } = await supabase
          .from('food_logs')
          .select('consumed_at')
          .eq('user_id', user.id)
          .gte('consumed_at', oneWeekAgo);

        if (weeklyLogs) {
          const uniqueDays = new Set(weeklyLogs.map(log => log.consumed_at.split('T')[0]));
          setWeeklyStreak(uniqueDays.size);
        }

      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();

    // Listen for updates
    const handleUpdate = () => loadUserData();
    window.addEventListener('food-logs-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('food-logs-updated', handleUpdate);
    };
  }, [user, currentNutrition.calories]);

  useEffect(() => {
    // Schedule notifications if permission is granted
    if (permission.granted) {
      scheduleWaterReminder(2 * 60 * 60 * 1000); // Every 2 hours
      
      // Schedule meal reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // 8 AM breakfast reminder
      scheduleMealReminder('Breakfast', tomorrow);
    }
  }, [permission.granted, scheduleWaterReminder, scheduleMealReminder]);

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in-scale">
      {/* Enhanced Header with Real Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Track your nutrition journey with real-time insights</p>
        </div>
        
        {/* Quick Stats with Real Data */}
        <QuickStats dailyGoalProgress={dailyGoalProgress} weeklyStreak={weeklyStreak} />
      </div>

      {/* Action Buttons */}
      <ActionButtons />

      {/* Enhanced Real-time Dashboard */}
      <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
        <EnhancedDashboard />
      </div>

      {/* AI Nutrition Coach with Real User Data */}
      <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
        <NutritionCoach 
          userGoals={userGoals.length > 0 ? userGoals : ['Start tracking your nutrition']}
          currentNutrition={currentNutrition}
        />
      </div>

      {/* Quick Actions & Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
          <WaterTracker />
        </div>
        <div className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
          <ExerciseTracker />
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        isMinimized={isChatMinimized} 
        onToggleMinimize={toggleChatMinimize} 
      />
    </div>
  );
};

export default Index;
