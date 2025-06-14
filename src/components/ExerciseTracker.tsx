
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, Clock, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  id: string;
  exercise_name: string;
  exercise_type: string;
  duration_minutes: number;
  calories_burned: number;
  intensity: string;
  date: string;
}

export const ExerciseTracker = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({
    exercise_name: '',
    exercise_type: 'cardio',
    duration_minutes: '',
    calories_burned: '',
    intensity: 'moderate'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTodayExercises();
    }
  }, [user]);

  const loadTodayExercises = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const addExercise = async () => {
    if (!user || !newExercise.exercise_name || !newExercise.duration_minutes) {
      toast({
        title: "Missing information",
        description: "Please fill in exercise name and duration.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('exercises')
        .insert({
          user_id: user.id,
          exercise_name: newExercise.exercise_name,
          exercise_type: newExercise.exercise_type,
          duration_minutes: parseInt(newExercise.duration_minutes),
          calories_burned: parseInt(newExercise.calories_burned) || null,
          intensity: newExercise.intensity,
          date: today
        });

      if (error) throw error;

      setNewExercise({
        exercise_name: '',
        exercise_type: 'cardio',
        duration_minutes: '',
        calories_burned: '',
        intensity: 'moderate'
      });

      await loadTodayExercises();
      toast({
        title: "Exercise added!",
        description: "Your workout has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding exercise",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration_minutes, 0);
  const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories_burned || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          Exercise Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Duration
            </div>
            <div className="text-lg font-bold">{totalDuration} min</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Flame className="h-3 w-3" />
              Calories
            </div>
            <div className="text-lg font-bold">{totalCalories}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Exercise name"
              value={newExercise.exercise_name}
              onChange={(e) => setNewExercise({ ...newExercise, exercise_name: e.target.value })}
            />
            <Select
              value={newExercise.exercise_type}
              onValueChange={(value) => setNewExercise({ ...newExercise, exercise_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Minutes"
              value={newExercise.duration_minutes}
              onChange={(e) => setNewExercise({ ...newExercise, duration_minutes: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Calories"
              value={newExercise.calories_burned}
              onChange={(e) => setNewExercise({ ...newExercise, calories_burned: e.target.value })}
            />
            <Select
              value={newExercise.intensity}
              onValueChange={(value) => setNewExercise({ ...newExercise, intensity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="vigorous">Vigorous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addExercise} disabled={loading} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>

        {exercises.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Today's Exercises</h4>
            {exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div>
                  <div className="font-medium">{exercise.exercise_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.duration_minutes} min • {exercise.calories_burned || 0} cal
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline">{exercise.exercise_type}</Badge>
                  <Badge variant="secondary">{exercise.intensity}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
