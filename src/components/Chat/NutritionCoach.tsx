
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CoachingSuggestion {
  type: 'nutrition' | 'exercise' | 'hydration' | 'sleep';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface NutritionCoachProps {
  userGoals?: string[];
  currentNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const NutritionCoach: React.FC<NutritionCoachProps> = ({
  userGoals = [],
  currentNutrition
}) => {
  const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateCoachingSuggestions = async () => {
    setLoading(true);
    try {
      const prompt = `As a nutrition coach, analyze this data:
      - User goals: ${userGoals.join(', ') || 'General health'}
      - Current nutrition: ${currentNutrition ? `${currentNutrition.calories} cal, ${currentNutrition.protein}g protein, ${currentNutrition.carbs}g carbs, ${currentNutrition.fat}g fat` : 'Not provided'}
      
      Provide 3-4 specific, actionable coaching suggestions. Format each as:
      TYPE|TITLE|DESCRIPTION|PRIORITY
      
      Types: nutrition, exercise, hydration, sleep
      Priority: high, medium, low`;

      const { data, error } = await supabase.functions.invoke('nutrition-api', {
        body: {
          action: 'chatWithGroq',
          messages: [{ role: 'user', content: prompt }]
        }
      });

      if (error) throw error;

      const parsed = parseCoachingSuggestions(data.assistantMessage);
      setSuggestions(parsed);
      
      toast({
        title: "Coaching suggestions updated",
        description: `Got ${parsed.length} personalized recommendations`,
      });
    } catch (error) {
      console.error('Failed to generate coaching suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate coaching suggestions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseCoachingSuggestions = (response: string): CoachingSuggestion[] => {
    const lines = response.split('\n').filter(line => line.includes('|'));
    return lines.map(line => {
      const [type, title, description, priority] = line.split('|').map(s => s.trim());
      return {
        type: (type.toLowerCase() as any) || 'nutrition',
        title: title || 'Nutrition tip',
        description: description || 'Keep tracking your nutrition!',
        priority: (priority.toLowerCase() as any) || 'medium'
      };
    }).slice(0, 4);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'exercise': return <TrendingUp className="h-4 w-4" />;
      case 'hydration': return <Target className="h-4 w-4" />;
      case 'sleep': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            AI Nutrition Coach
          </CardTitle>
          <Button 
            onClick={generateCoachingSuggestions}
            disabled={loading}
            size="sm"
          >
            {loading ? 'Analyzing...' : 'Get Suggestions'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Click "Get Suggestions" for personalized coaching tips based on your current progress.
          </p>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIconForType(suggestion.type)}
                  <h4 className="font-medium">{suggestion.title}</h4>
                </div>
                <Badge variant={getPriorityColor(suggestion.priority)}>
                  {suggestion.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
