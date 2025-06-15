
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Recycle, Plus, X } from 'lucide-react';
import { aiMealPlanningService } from '@/services/aiMealPlanning';
import { useToast } from '@/hooks/use-toast';

export const LeftoverOptimizer: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [preferences, setPreferences] = useState<string[]>(['Quick meals', 'Healthy options']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const optimizeLeftovers = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some leftover ingredients first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const recipeSuggestions = await aiMealPlanningService.optimizeLeftovers(ingredients, preferences);
      setSuggestions(recipeSuggestions);
      
      toast({
        title: "Leftover recipes generated!",
        description: `Found ${recipeSuggestions.length} creative ways to use your leftovers`,
      });
    } catch (error) {
      console.error('Failed to optimize leftovers:', error);
      toast({
        title: "Error",
        description: "Failed to generate leftover recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-green-600" />
          Leftover Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Ingredients */}
        <div>
          <Label htmlFor="ingredient">Add leftover ingredients</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="ingredient"
              placeholder="e.g., chicken, rice, broccoli"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addIngredient} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Current Ingredients */}
        {ingredients.length > 0 && (
          <div>
            <Label>Current ingredients:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeIngredient(ingredient)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Optimize Button */}
        <Button 
          onClick={optimizeLeftovers} 
          disabled={loading || ingredients.length === 0}
          className="w-full"
        >
          {loading ? 'Finding recipes...' : 'Get Recipe Suggestions'}
        </Button>

        {/* Recipe Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <Label>Recipe suggestions:</Label>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
