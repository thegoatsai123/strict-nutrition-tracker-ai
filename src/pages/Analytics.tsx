
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NutritionChart } from '@/components/Charts/NutritionChart';
import { WeightProgressChart } from '@/components/Charts/WeightProgressChart';
import { DataExportModal } from '@/components/DataExport/DataExportModal';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [showExportModal, setShowExportModal] = useState(false);
  const [nutritionData, setNutritionData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Load nutrition data
    const { data: foodLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('consumed_at', startDate.toISOString());

    // Load progress data
    const { data: progress } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0]);

    // Process nutrition data
    const nutritionByDate = foodLogs?.reduce((acc: any, log: any) => {
      const date = log.consumed_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0, calorieGoal: 2000 };
      }
      acc[date].calories += log.calories || 0;
      acc[date].protein += log.protein || 0;
      acc[date].carbs += log.carbohydrates || 0;
      acc[date].fat += log.fat || 0;
      return acc;
    }, {});

    setNutritionData(Object.values(nutritionByDate || {}));

    // Process weight data
    const weightByDate = progress?.map((p: any) => ({
      date: p.date,
      weight: p.weight || 0,
      targetWeight: 70 // Could be dynamic based on user goals
    })) || [];

    setWeightData(weightByDate);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <Button onClick={() => setShowExportModal(true)}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'pie') => setChartType(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Calories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nutritionData.length > 0 
                ? Math.round(nutritionData.reduce((sum: number, day: any) => sum + day.calories, 0) / nutritionData.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">calories per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Protein</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nutritionData.length > 0 
                ? Math.round(nutritionData.reduce((sum: number, day: any) => sum + day.protein, 0) / nutritionData.length)
                : 0
              }g
            </div>
            <p className="text-xs text-muted-foreground">grams per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Logged</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionData.length}</div>
            <p className="text-xs text-muted-foreground">
              of {timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NutritionChart 
          data={nutritionData} 
          type={chartType} 
          title={`Nutrition Trends - ${timeRange}`}
        />
        <WeightProgressChart data={weightData} />
      </div>

      <DataExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

export default Analytics;
