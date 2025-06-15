
import { Card } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Award } from 'lucide-react';

interface QuickStatsProps {
  dailyGoalProgress: number;
  weeklyStreak: number;
}

export const QuickStats = ({ dailyGoalProgress, weeklyStreak }: QuickStatsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <AnimatedCard className="p-4 min-w-[120px]" animationDelay={100}>
        <div className="flex items-center gap-3">
          <ProgressRing progress={dailyGoalProgress} size={50} strokeWidth={4}>
            <span className="text-xs font-bold">{dailyGoalProgress}%</span>
          </ProgressRing>
          <div>
            <p className="text-sm font-medium">Daily Goal</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
        </div>
      </AnimatedCard>
      
      <AnimatedCard className="p-4 min-w-[120px]" animationDelay={200}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Award className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-lg font-bold">{weeklyStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};
