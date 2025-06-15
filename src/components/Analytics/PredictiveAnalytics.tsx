
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface PredictionData {
  date: string;
  predicted_weight: number;
  actual_weight?: number;
  confidence: number;
}

interface CorrelationData {
  factor: string;
  correlation: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface HealthInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  recommendation: string;
}

export const PredictiveAnalytics: React.FC = () => {
  const [weightPredictions, setWeightPredictions] = useState<PredictionData[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock predictive data
      const mockPredictions: PredictionData[] = [
        { date: '2024-01-01', predicted_weight: 175, actual_weight: 175, confidence: 0.95 },
        { date: '2024-01-08', predicted_weight: 174.2, actual_weight: 174.5, confidence: 0.92 },
        { date: '2024-01-15', predicted_weight: 173.8, actual_weight: 173.9, confidence: 0.89 },
        { date: '2024-01-22', predicted_weight: 173.1, confidence: 0.87 },
        { date: '2024-01-29', predicted_weight: 172.5, confidence: 0.84 },
        { date: '2024-02-05', predicted_weight: 171.9, confidence: 0.82 },
        { date: '2024-02-12', predicted_weight: 171.3, confidence: 0.80 }
      ];

      const mockCorrelations: CorrelationData[] = [
        {
          factor: 'Daily Steps',
          correlation: 0.78,
          impact: 'positive',
          description: 'Higher step count strongly correlates with weight loss'
        },
        {
          factor: 'Sleep Quality',
          correlation: 0.65,
          impact: 'positive',
          description: 'Better sleep quality improves metabolism and weight management'
        },
        {
          factor: 'Protein Intake',
          correlation: 0.72,
          impact: 'positive',
          description: 'Higher protein intake supports muscle retention during weight loss'
        },
        {
          factor: 'Late Night Eating',
          correlation: -0.58,
          impact: 'negative',
          description: 'Eating late at night negatively impacts weight loss progress'
        },
        {
          factor: 'Stress Level',
          correlation: -0.43,
          impact: 'negative',
          description: 'Higher stress levels can slow down weight loss'
        }
      ];

      const mockInsights: HealthInsight[] = [
        {
          type: 'success',
          title: 'Excellent Progress',
          message: 'You\'re on track to reach your goal weight by March 15th',
          recommendation: 'Keep maintaining your current routine of 8,000+ steps daily'
        },
        {
          type: 'warning',
          title: 'Protein Intake Low',
          message: 'Your protein intake has been below target for 3 consecutive days',
          recommendation: 'Add a protein shake or lean meat to your meals'
        },
        {
          type: 'info',
          title: 'Sleep Pattern Insight',
          message: 'Your best weight loss days correlate with 7+ hours of sleep',
          recommendation: 'Maintain a consistent bedtime routine for optimal results'
        }
      ];

      setWeightPredictions(mockPredictions);
      setCorrelations(mockCorrelations);
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Target className="h-5 w-5 text-blue-600" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return correlation > 0 ? 'text-green-600' : 'text-red-600';
    if (abs >= 0.5) return correlation > 0 ? 'text-green-500' : 'text-red-500';
    return 'text-gray-500';
  };

  const CORRELATION_COLORS = ['#22c55e', '#ef4444', '#6b7280', '#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Predictive Analytics</h2>
        <Badge variant="outline">AI-Powered Insights</Badge>
      </div>

      {/* Health Insights */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Health Insights</h3>
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{insight.message}</p>
                  <p className="text-sm font-medium">💡 {insight.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weight Prediction Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            Weight Prediction Model
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 2', 'dataMax + 1']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual_weight" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  name="Actual Weight"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted_weight" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Prediction confidence decreases over time. Current model accuracy: 89%</p>
          </div>
        </CardContent>
      </Card>

      {/* Correlation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Correlation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {correlations.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.factor}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getCorrelationColor(item.correlation)}`}>
                      {item.correlation > 0 ? '+' : ''}{(item.correlation * 100).toFixed(0)}%
                    </div>
                    <div className="flex items-center gap-1">
                      {item.correlation > 0 ? 
                        <TrendingUp className="h-3 w-3 text-green-600" /> : 
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      }
                      <span className="text-xs text-muted-foreground">
                        {Math.abs(item.correlation) >= 0.7 ? 'Strong' : 
                         Math.abs(item.correlation) >= 0.5 ? 'Moderate' : 'Weak'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factor Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={correlations.map((item, index) => ({
                      name: item.factor,
                      value: Math.abs(item.correlation),
                      color: CORRELATION_COLORS[index % CORRELATION_COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {correlations.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CORRELATION_COLORS[index % CORRELATION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${(value * 100).toFixed(0)}%`, 'Correlation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
