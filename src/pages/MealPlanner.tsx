
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2, CalendarDays } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface MealPlanItem {
  id: string;
  day_of_week: number;
  meal_type: string;
  recipe_title: string;
  recipe_calories: number;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null);
  const [mealPlanItems, setMealPlanItems] = useState<MealPlanItem[]>([]);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadMealPlans();
    }
  }, [user]);

  const loadMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMealPlans(data || []);
      
      const active = data?.find(plan => plan.is_active);
      if (active) {
        setActivePlan(active);
        loadMealPlanItems(active.id);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
    }
  };

  const loadMealPlanItems = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .select('*')
        .eq('meal_plan_id', planId)
        .order('day_of_week')
        .order('meal_type');

      if (error) throw error;
      setMealPlanItems(data || []);
    } catch (error) {
      console.error('Error loading meal plan items:', error);
    }
  };

  const createMealPlan = async () => {
    if (!user || !newPlan.name || !newPlan.start_date || !newPlan.end_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          name: newPlan.name,
          description: newPlan.description,
          start_date: newPlan.start_date,
          end_date: newPlan.end_date,
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      setNewPlan({ name: '', description: '', start_date: '', end_date: '' });
      await loadMealPlans();
      toast({
        title: "Meal plan created!",
        description: "Your new meal plan has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating meal plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activatePlan = async (planId: string) => {
    setLoading(true);
    try {
      // Deactivate all plans first
      await supabase
        .from('meal_plans')
        .update({ is_active: false })
        .eq('user_id', user?.id);

      // Activate the selected plan
      const { error } = await supabase
        .from('meal_plans')
        .update({ is_active: true })
        .eq('id', planId);

      if (error) throw error;

      await loadMealPlans();
      toast({
        title: "Meal plan activated",
        description: "This meal plan is now active.",
      });
    } catch (error: any) {
      toast({
        title: "Error activating meal plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMealsForDay = (dayIndex: number) => {
    return mealPlanItems.filter(item => item.day_of_week === dayIndex);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-primary" />
          Meal Planner
        </h1>
      </div>

      {/* Create New Meal Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Meal Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Meal plan name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Start date"
              value={newPlan.start_date}
              onChange={(e) => setNewPlan({ ...newPlan, start_date: e.target.value })}
            />
            <Input
              type="date"
              placeholder="End date"
              value={newPlan.end_date}
              onChange={(e) => setNewPlan({ ...newPlan, end_date: e.target.value })}
            />
          </div>
          <Button onClick={createMealPlan} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Create Meal Plan
          </Button>
        </CardContent>
      </Card>

      {/* Meal Plans List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {mealPlans.length === 0 ? (
            <p className="text-muted-foreground">No meal plans created yet.</p>
          ) : (
            <div className="grid gap-4">
              {mealPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {plan.start_date} to {plan.end_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.is_active && <Badge>Active</Badge>}
                    {!plan.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => activatePlan(plan.id)}
                        disabled={loading}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Meal Plan Schedule */}
      {activePlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {activePlan.name} - Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={day} className="border rounded-lg p-3">
                  <h4 className="font-medium text-center mb-3">{day}</h4>
                  <div className="space-y-2">
                    {MEAL_TYPES.map((mealType) => {
                      const meal = getMealsForDay(index).find(item => item.meal_type === mealType);
                      return (
                        <div key={mealType} className="text-sm">
                          <div className="font-medium capitalize text-muted-foreground">{mealType}</div>
                          {meal ? (
                            <div className="mt-1 p-2 bg-muted rounded text-xs">
                              {meal.recipe_title}
                              {meal.recipe_calories && (
                                <div className="text-muted-foreground">
                                  {meal.recipe_calories} cal
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-1 p-2 border-2 border-dashed border-muted rounded text-xs text-muted-foreground">
                              Add meal
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealPlanner;
