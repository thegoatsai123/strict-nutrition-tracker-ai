
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface Recommendation {
  id: string;
  type: 'nutrition' | 'meal' | 'health' | 'goal';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  estimatedImpact: number; // 1-5 scale
}

export const SmartRecommendations = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [profile]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Simulate AI analysis based on user profile and recent activity
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        type: 'nutrition',
        title: 'Increase Vitamin D Intake',
        description: 'Based on your diet analysis, you may be low in Vitamin D. Consider adding fatty fish or fortified foods.',
        priority: 'high',
        actionable: true,
        estimatedImpact: 4
      },
      {
        id: '2',
        type: 'meal',
        title: 'Try Mediterranean Quinoa Bowl',
        description: 'This meal matches your taste preferences and helps meet your protein goals.',
        priority: 'medium',
        actionable: true,
        estimatedImpact: 3
      },
      {
        id: '3',
        type: 'health',
        title: 'Reduce Sodium Intake',
        description: 'Your average sodium intake is 15% above recommended levels. Consider reducing processed foods.',
        priority: 'high',
        actionable: true,
        estimatedImpact: 4
      },
      {
        id: '4',
        type: 'goal',
        title: 'Adjust Calorie Target',
        description: 'Based on your progress, consider increasing daily calories by 200 to support your muscle building goal.',
        priority: 'medium',
        actionable: true,
        estimatedImpact: 5
      }
    ];

    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Analyzing your nutrition data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Personalized insights based on your nutrition data and goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getPriorityIcon(rec.priority)}
                <h4 className="font-semibold">{rec.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(rec.priority) as any}>
                  {rec.priority} priority
                </Badge>
                <Badge variant="outline">
                  Impact: {rec.estimatedImpact}/5
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{rec.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {rec.type}
              </Badge>
              {rec.actionable && (
                <Button size="sm" variant="outline">
                  Take Action
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <Button onClick={generateRecommendations} variant="outline" className="w-full">
            <Brain className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
