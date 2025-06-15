
import { supabase } from '@/integrations/supabase/client';

export interface MealPlanRequest {
  dietaryRestrictions?: string[];
  calorieGoal?: number;
  proteinGoal?: number;
  preferredCuisines?: string[];
  excludedIngredients?: string[];
  mealCount?: number;
  days?: number;
}

export interface GeneratedMealPlan {
  name: string;
  description: string;
  meals: {
    day: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string[];
  }[];
}

export class AIMealPlanningService {
  async generateMealPlan(request: MealPlanRequest): Promise<GeneratedMealPlan> {
    const prompt = this.buildMealPlanPrompt(request);
    
    const { data, error } = await supabase.functions.invoke('nutrition-api', {
      body: {
        action: 'chatWithGroq',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    });

    if (error) {
      throw new Error(`Failed to generate meal plan: ${error.message}`);
    }

    return this.parseMealPlanResponse(data.assistantMessage);
  }

  async suggestRecipeSubstitutions(originalRecipe: string, dietaryNeeds: string[]): Promise<string[]> {
    const prompt = `Given this recipe: "${originalRecipe}", suggest 3 healthy substitutions that meet these dietary needs: ${dietaryNeeds.join(', ')}. Focus on maintaining nutrition while improving health benefits.`;
    
    const { data, error } = await supabase.functions.invoke('nutrition-api', {
      body: {
        action: 'chatWithGroq',
        messages: [{ role: 'user', content: prompt }]
      }
    });

    if (error) {
      throw new Error(`Failed to get substitutions: ${error.message}`);
    }

    return this.parseSubstitutions(data.assistantMessage);
  }

  async optimizeLeftovers(ingredients: string[], preferences: string[]): Promise<string[]> {
    const prompt = `I have these leftover ingredients: ${ingredients.join(', ')}. Suggest 3 quick, healthy recipes I can make. Consider these preferences: ${preferences.join(', ')}.`;
    
    const { data, error } = await supabase.functions.invoke('nutrition-api', {
      body: {
        action: 'chatWithGroq',
        messages: [{ role: 'user', content: prompt }]
      }
    });

    if (error) {
      throw new Error(`Failed to optimize leftovers: ${error.message}`);
    }

    return this.parseRecipeSuggestions(data.assistantMessage);
  }

  private buildMealPlanPrompt(request: MealPlanRequest): string {
    const days = request.days || 7;
    const calorieGoal = request.calorieGoal || 2000;
    
    return `Create a ${days}-day meal plan with these requirements:
    - Daily calorie target: ${calorieGoal} calories
    - Protein goal: ${request.proteinGoal || Math.round(calorieGoal * 0.15 / 4)}g
    - Dietary restrictions: ${request.dietaryRestrictions?.join(', ') || 'None'}
    - Preferred cuisines: ${request.preferredCuisines?.join(', ') || 'Any'}
    - Exclude: ${request.excludedIngredients?.join(', ') || 'None'}
    
    Format as JSON with this structure:
    {
      "name": "Meal Plan Name",
      "description": "Brief description",
      "meals": [
        {
          "day": 1,
          "mealType": "breakfast",
          "recipeName": "Recipe Name",
          "calories": 400,
          "protein": 20,
          "carbs": 45,
          "fat": 15,
          "ingredients": ["ingredient1", "ingredient2"],
          "instructions": ["step1", "step2"]
        }
      ]
    }`;
  }

  private parseMealPlanResponse(response: string): GeneratedMealPlan {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse meal plan JSON:', error);
    }
    
    // Fallback parsing
    return {
      name: "AI Generated Meal Plan",
      description: "A personalized meal plan created by your nutrition assistant",
      meals: []
    };
  }

  private parseSubstitutions(response: string): string[] {
    const lines = response.split('\n').filter(line => line.trim());
    return lines.slice(0, 3).map(line => line.replace(/^\d+\.\s*/, '').trim());
  }

  private parseRecipeSuggestions(response: string): string[] {
    const lines = response.split('\n').filter(line => line.trim());
    return lines.slice(0, 3).map(line => line.replace(/^\d+\.\s*/, '').trim());
  }
}

export const aiMealPlanningService = new AIMealPlanningService();
