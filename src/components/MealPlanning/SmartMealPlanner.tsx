
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Calendar, ChefHat, Clock } from 'lucide-react';
import { aiMealPlanningService, type MealPlanRequest, type GeneratedMealPlan } from '@/services/aiMealPlanning';
import { useToast } from '@/hooks/use-toast';

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Keto', 'Paleo', 'Low-Carb', 'Mediterranean'
];

const CUISINE_TYPES = [
  'Italian', 'Asian', 'Mexican', 'Mediterranean', 
  'American', 'Indian', 'Thai', 'French'
];

export const SmartMealPlanner: React.FC = () => {
  const [request, setRequest] = useState<MealPlanRequest>({
    calorieGoal: 2000,
    proteinGoal: 150,
    days: 7,
    mealCount: 3,
    dietaryRestrictions: [],
    preferredCuisines: [],
    excludedIngredients: []
  });
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [excludedText, setExcludedText] = useState('');
  const { toast } = useToast();

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    setRequest(prev => ({
      ...prev,
      dietaryRestrictions: checked 
        ? [...(prev.dietaryRestrictions || []), restriction]
        : (prev.dietaryRestrictions || []).filter(r => r !== restriction)
    }));
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    setRequest(prev => ({
      ...prev,
      preferredCuisines: checked 
        ? [...(prev.preferredCuisines || []), cuisine]
        : (prev.preferredCuisines || []).filter(c => c !== cuisine)
    }));
  };

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const finalRequest = {
        ...request,
        excludedIngredients: excludedText.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const plan = await aiMealPlanningService.generateMealPlan(finalRequest);
      setGeneratedPlan(plan);
      
      toast({
        title: "Meal plan generated!",
        description: `Created a ${request.days}-day personalized meal plan`,
      });
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupMealsByDay = (meals: GeneratedMealPlan['meals']) => {
    const grouped: { [key: number]: GeneratedMealPlan['meals'] } = {};
    meals.forEach(meal => {
      if (!grouped[meal.day]) grouped[meal.day] = [];
      grouped[meal.day].push(meal);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Meal Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Goals */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calories">Daily Calories</Label>
              <Input
                id="calories"
                type="number"
                value={request.calorieGoal}
                onChange={(e) => setRequest(prev => ({ ...prev, calorieGoal: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein Goal (g)</Label>
              <Input
                id="protein"
                type="number"
                value={request.proteinGoal}
                onChange={(e) => setRequest(prev => ({ ...prev, proteinGoal: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="14"
                value={request.days}
                onChange={(e) => setRequest(prev => ({ ...prev, days: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="meals">Meals per Day</Label>
              <Input
                id="meals"
                type="number"
                min="2"
                max="6"
                value={request.mealCount}
                onChange={(e) => setRequest(prev => ({ ...prev, mealCount: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <Label className="text-base font-medium">Dietary Restrictions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {DIETARY_RESTRICTIONS.map(restriction => (
                <div key={restriction} className="flex items-center space-x-2">
                  <Checkbox
                    id={restriction}
                    checked={request.dietaryRestrictions?.includes(restriction)}
                    onCheckedChange={(checked) => handleDietaryChange(restriction, checked as boolean)}
                  />
                  <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Cuisines */}
          <div>
            <Label className="text-base font-medium">Preferred Cuisines</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {CUISINE_TYPES.map(cuisine => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={cuisine}
                    checked={request.preferredCuisines?.includes(cuisine)}
                    onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
                  />
                  <Label htmlFor={cuisine} className="text-sm">{cuisine}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded Ingredients */}
          <div>
            <Label htmlFor="excluded">Excluded Ingredients (comma-separated)</Label>
            <Textarea
              id="excluded"
              placeholder="e.g., shellfish, nuts, mushrooms"
              value={excludedText}
              onChange={(e) => setExcludedText(e.target.value)}
            />
          </div>

          <Button onClick={generateMealPlan} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Meal Plan...
              </>
            ) : (
              <>
                <ChefHat className="mr-2 h-4 w-4" />
                Generate AI Meal Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Meal Plan */}
      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              {generatedPlan.name}
            </CardTitle>
            <p className="text-muted-foreground">{generatedPlan.description}</p>
          </CardHeader>
          <CardContent>
            {Object.entries(groupMealsByDay(generatedPlan.meals)).map(([day, meals]) => (
              <div key={day} className="mb-6">
                <h3 className="font-semibold mb-3 text-lg">Day {day}</h3>
                <div className="grid gap-3">
                  {meals.map((meal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{meal.recipeName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {meal.mealType}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {meal.calories} cal • {meal.protein}g protein
                        </div>
                      </div>
                      {meal.ingredients.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
