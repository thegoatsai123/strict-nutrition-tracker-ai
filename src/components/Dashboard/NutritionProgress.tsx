
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';

interface NutritionProgressProps {
  current: number;
  goal: number;
  label: string;
  unit: string;
  color?: string;
  type: 'calories' | 'protein' | 'carbs' | 'fat' | 'water';
  trend?: 'up' | 'down' | 'stable';
  isGoalMet?: boolean;
}

export const NutritionProgress: React.FC<NutritionProgressProps> = ({
  current,
  goal,
  label,
  unit,
  color = 'hsl(var(--primary))',
  type,
  trend,
  isGoalMet = false
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const isOverGoal = current > goal;
  
  const getIcon = () => {
    switch (type) {
      case 'calories': return <Flame className="h-4 w-4" />;
      case 'protein': return <Target className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (type === 'calories') {
      return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
    }
    return trend === 'up' ? 'text-green-500' : 'text-gray-500';
  };

  return (
    <AnimatedCard className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getIcon()}
            {label}
          </CardTitle>
          {isOverGoal && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <ProgressRing 
            progress={percentage} 
            size={80} 
            strokeWidth={6}
            color={isOverGoal ? 'hsl(var(--destructive))' : color}
            animated={true}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{Math.round(current)}</div>
              <div className="text-xs text-muted-foreground">{unit}</div>
            </div>
          </ProgressRing>
        </div>
        
        <div className="text-center space-y-1">
          <div className="text-sm text-muted-foreground">
            Goal: {goal} {unit}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge 
              variant={isGoalMet ? 'default' : isOverGoal ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {percentage.toFixed(0)}%
            </Badge>
            {trend && (
              <TrendingUp className={`h-3 w-3 ${getTrendColor()}`} />
            )}
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};
