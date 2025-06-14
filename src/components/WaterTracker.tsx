
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTodayWaterIntake();
    }
  }, [user]);

  const loadTodayWaterIntake = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading water intake:', error);
        return;
      }

      if (data) {
        setWaterIntake(data.amount_ml);
        setWaterGoal(data.goal_ml);
      }
    } catch (error) {
      console.error('Error loading water intake:', error);
    }
  };

  const updateWaterIntake = async (newAmount: number) => {
    if (!user || newAmount < 0) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('water_intake')
        .upsert({
          user_id: user.id,
          date: today,
          amount_ml: newAmount,
          goal_ml: waterGoal
        });

      if (error) throw error;

      setWaterIntake(newAmount);
      toast({
        title: "Water intake updated",
        description: `You've consumed ${newAmount}ml of water today.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating water intake",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addWater = (amount: number) => {
    updateWaterIntake(waterIntake + amount);
  };

  const percentage = Math.min((waterIntake / waterGoal) * 100, 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">
            {waterIntake}ml / {waterGoal}ml
          </div>
          <Progress value={percentage} className="w-full" />
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addWater(250)}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              250ml
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addWater(500)}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              500ml
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addWater(-250)}
              disabled={loading || waterIntake < 250}
              className="flex items-center gap-1"
            >
              <Minus className="h-3 w-3" />
              250ml
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {percentage >= 100 ? "🎉 Goal achieved!" : `${Math.round(100 - percentage)}% to go`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
