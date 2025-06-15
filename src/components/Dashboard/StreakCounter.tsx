
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Flame, Award, Calendar, Target } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'weekly' | 'monthly';
  goal: string;
  lastActivity?: Date;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  streakType,
  goal,
  lastActivity
}) => {
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💪';
    return '🎯';
  };

  const getEncouragementMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak < 3) return "Keep it up!";
    if (currentStreak < 7) return "You're on fire!";
    if (currentStreak < 14) return "Incredible momentum!";
    if (currentStreak < 30) return "Unstoppable!";
    return "Legendary streak!";
  };

  return (
    <AnimatedCard className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          {streakType.charAt(0).toUpperCase() + streakType.slice(1)} Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl mb-2">{getStreakEmoji(currentStreak)}</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">
            {streakType === 'daily' ? 'days' : streakType === 'weekly' ? 'weeks' : 'months'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Best
            </span>
            <Badge variant="outline">{longestStreak}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Goal
            </span>
            <span className="text-muted-foreground">{goal}</span>
          </div>

          {lastActivity && (
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last
              </span>
              <span className="text-muted-foreground">
                {lastActivity.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <Badge 
            variant={currentStreak > 0 ? 'default' : 'secondary'}
            className="text-xs"
          >
            {getEncouragementMessage()}
          </Badge>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};
