
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictiveAnalytics } from '@/components/Analytics/PredictiveAnalytics';
import { TrendingUp, BarChart3, Brain, Calendar } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Advanced Analytics
        </h1>
        <Badge variant="outline">AI-Powered Insights</Badge>
      </div>

      <Tabs defaultValue="predictive" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Predictive
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced trend analysis coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Comprehensive nutrition reports coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
