
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Droplets, Clock, Bell, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

interface HydrationReminderProps {
  currentIntake: number;
  dailyGoal: number;
  lastIntakeTime?: Date;
  onAddWater: (amount: number) => void;
}

export const HydrationReminder: React.FC<HydrationReminderProps> = ({
  currentIntake,
  dailyGoal,
  lastIntakeTime,
  onAddWater
}) => {
  const [timeUntilReminder, setTimeUntilReminder] = useState<number>(0);
  const [isReminderActive, setIsReminderActive] = useState(false);
  const { scheduleWaterReminder, permission } = useNotifications();
  const { toast } = useToast();

  const percentage = Math.min((currentIntake / dailyGoal) * 100, 100);
  const remainingWater = Math.max(dailyGoal - currentIntake, 0);
  
  // Calculate time since last intake
  const timeSinceLastIntake = lastIntakeTime 
    ? Date.now() - lastIntakeTime.getTime() 
    : 0;
  
  const hoursSinceLastIntake = timeSinceLastIntake / (1000 * 60 * 60);

  useEffect(() => {
    // Set up reminder countdown
    const interval = setInterval(() => {
      if (hoursSinceLastIntake >= 2 && !isReminderActive) {
        setIsReminderActive(true);
        if (permission.granted) {
          toast({
            title: "💧 Hydration Reminder",
            description: "Time to drink some water! Stay hydrated.",
          });
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [hoursSinceLastIntake, isReminderActive, permission.granted, toast]);

  const handleQuickAdd = (amount: number) => {
    onAddWater(amount);
    setIsReminderActive(false);
    
    toast({
      title: "Water logged! 💧",
      description: `Added ${amount}ml. Keep up the good hydration!`,
    });
  };

  const getHydrationStatus = () => {
    if (percentage >= 100) return { message: "Goal achieved! 🎉", color: "text-green-600" };
    if (percentage >= 75) return { message: "Almost there! 💪", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good progress! 👍", color: "text-blue-500" };
    if (percentage >= 25) return { message: "Keep going! 🚀", color: "text-yellow-600" };
    return { message: "Let's start hydrating! 💧", color: "text-gray-600" };
  };

  const status = getHydrationStatus();

  return (
    <AnimatedCard className={`${isReminderActive ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-950/20' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            Hydration Tracker
          </div>
          {isReminderActive && (
            <Bell className="h-4 w-4 text-blue-500 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{currentIntake}ml</span>
            <span className="text-muted-foreground">{dailyGoal}ml</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className={`text-center text-sm font-medium ${status.color}`}>
            {status.message}
          </div>
        </div>

        {remainingWater > 0 && (
          <div className="text-center text-xs text-muted-foreground">
            {remainingWater}ml remaining
          </div>
        )}

        {lastIntakeTime && (
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last: {Math.round(hoursSinceLastIntake * 10) / 10}h ago
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={isReminderActive ? "default" : "outline"}
            onClick={() => handleQuickAdd(250)}
            className="text-xs"
          >
            <Droplets className="h-3 w-3 mr-1" />
            250ml
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdd(500)}
            className="text-xs"
          >
            <Droplets className="h-3 w-3 mr-1" />
            500ml
          </Button>
        </div>

        {isReminderActive && (
          <div className="text-center">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsReminderActive(false)}
              className="text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Dismiss reminder
            </Button>
          </div>
        )}
      </CardContent>
    </AnimatedCard>
  );
};
