
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PredictiveAnalytics } from '@/components/Analytics/PredictiveAnalytics';
import { TrendingUp, BarChart3, Brain, Calendar, Download, Target, Zap, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - in real app this would come from API
  const weeklyData = [
    { day: 'Mon', calories: 2100, protein: 120, carbs: 280, fat: 70, goal: 2000 },
    { day: 'Tue', calories: 1950, protein: 110, carbs: 250, fat: 65, goal: 2000 },
    { day: 'Wed', calories: 2200, protein: 135, carbs: 300, fat: 75, goal: 2000 },
    { day: 'Thu', calories: 1850, protein: 105, carbs: 220, fat: 60, goal: 2000 },
    { day: 'Fri', calories: 2350, protein: 150, carbs: 320, fat: 80, goal: 2000 },
    { day: 'Sat', calories: 2100, protein: 125, carbs: 275, fat: 72, goal: 2000 },
    { day: 'Sun', calories: 1900, protein: 115, carbs: 240, fat: 68, goal: 2000 },
  ];

  const macroData = [
    { name: 'Protein', value: 28, color: '#FF6B6B' },
    { name: 'Carbs', value: 45, color: '#4ECDC4' },
    { name: 'Fat', value: 27, color: '#45B7D1' },
  ];

  const progressMetrics = [
    { metric: 'Daily Goal Achievement', value: '85%', trend: '+5%', color: 'text-green-600' },
    { metric: 'Average Calories', value: '2064', trend: '+120', color: 'text-blue-600' },
    { metric: 'Protein Intake', value: '122g', trend: '+8g', color: 'text-purple-600' },
    { metric: 'Water Intake', value: '2.1L', trend: '+0.3L', color: 'text-cyan-600' },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into your nutrition journey</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI-Powered Insights
          </Badge>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {progressMetrics.map((item, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">{item.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold">{item.value}</p>
                  <span className={`text-xs font-medium ${item.color}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2 text-xs md:text-sm">
            <Brain className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Predictive</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 text-xs md:text-sm">
            <Calendar className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calorie Tracking Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Daily Calorie Intake</span>
                  <Target className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="goal" stroke="#82ca9d" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Macro Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Macro Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Macronutrient Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="protein" fill="#FF6B6B" name="Protein" />
                    <Bar dataKey="carbs" fill="#4ECDC4" name="Carbs" />
                    <Bar dataKey="fat" fill="#45B7D1" name="Fat" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  7-Day Streak
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Protein Goal Met
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Consistent Logging
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Monthly Challenge
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Current Weight</p>
                      <p className="text-2xl font-bold">72.5 kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Change this month</p>
                      <p className="text-green-600 font-medium">-1.2 kg</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're on track to reach your goal weight of 70kg by your target date.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutrition Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Goal Achievement Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Logging Consistency</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                  <p className="text-sm text-muted-foreground">Protein Intake</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">-8%</p>
                  <p className="text-sm text-muted-foreground">Sugar Intake</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">+5%</p>
                  <p className="text-sm text-muted-foreground">Fiber Intake</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">+18%</p>
                  <p className="text-sm text-muted-foreground">Water Intake</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Nutrition Reports</h2>
              <p className="text-muted-foreground">Generate and download detailed nutrition reports</p>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive weekly nutrition summary with goal comparisons
                </p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Detailed monthly analysis with trends and recommendations
                </p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Progress Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your progress towards nutrition and fitness goals
                </p>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Report - Week 23, 2024</p>
                    <p className="text-sm text-muted-foreground">Generated on June 10, 2024</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Analysis - May 2024</p>
                    <p className="text-sm text-muted-foreground">Generated on June 1, 2024</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
