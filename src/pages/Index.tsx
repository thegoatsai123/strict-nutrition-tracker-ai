
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

const Index = () => {
  const [dailyGoalProgress, setDailyGoalProgress] = useState(73);
  const [weeklyStreak, setWeeklyStreak] = useState(5);
  
  const { permission, scheduleWaterReminder, scheduleMealReminder } = useNotifications();
  const { isChatMinimized, toggleChatMinimize } = useChat();

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

  // Mock current nutrition data - in a real app this would come from today's logged foods
  const currentNutrition = {
    calories: 1650,
    protein: 120,
    carbs: 180,
    fat: 65
  };

  const userGoals = ['Weight loss', 'Muscle building', 'Better energy'];

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in-scale">
      {/* Enhanced Header with Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Track your nutrition journey with smart insights</p>
        </div>
        
        {/* Quick Stats */}
        <QuickStats dailyGoalProgress={dailyGoalProgress} weeklyStreak={weeklyStreak} />
      </div>

      {/* Action Buttons */}
      <ActionButtons />

      {/* Enhanced Real-time Dashboard */}
      <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
        <EnhancedDashboard />
      </div>

      {/* AI Nutrition Coach */}
      <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
        <NutritionCoach 
          userGoals={userGoals}
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
