
import { useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, User } from 'lucide-react';

const Dashboard = () => {
  const [todayStats] = useState({
    calories: 1850,
    calorieGoal: 2200,
    protein: 85,
    proteinGoal: 120,
    carbs: 220,
    carbGoal: 275,
    fat: 65,
    fatGoal: 73
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your nutrition progress and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Today</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.calories}</div>
              <p className="text-xs text-muted-foreground">
                of {todayStats.calorieGoal} goal
              </p>
              <Progress 
                value={(todayStats.calories / todayStats.calorieGoal) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <ArrowDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.protein}g</div>
              <p className="text-xs text-muted-foreground">
                of {todayStats.proteinGoal}g goal
              </p>
              <Progress 
                value={(todayStats.protein / todayStats.proteinGoal) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              <ArrowUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.carbs}g</div>
              <p className="text-xs text-muted-foreground">
                of {todayStats.carbGoal}g goal
              </p>
              <Progress 
                value={(todayStats.carbs / todayStats.carbGoal) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fat</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.fat}g</div>
              <p className="text-xs text-muted-foreground">
                of {todayStats.fatGoal}g goal
              </p>
              <Progress 
                value={(todayStats.fat / todayStats.fatGoal) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
              <CardDescription>Your food log for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Breakfast</h4>
                    <p className="text-sm text-gray-600">Oatmeal with berries</p>
                  </div>
                  <span className="font-medium">320 cal</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Lunch</h4>
                    <p className="text-sm text-gray-600">Grilled chicken salad</p>
                  </div>
                  <span className="font-medium">450 cal</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Dinner</h4>
                    <p className="text-sm text-gray-600">Salmon with vegetables</p>
                  </div>
                  <span className="font-medium">580 cal</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Full Food Log
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your nutrition trends this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Calories</span>
                  <span className="text-sm">1,920 cal/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Protein Goal Achievement</span>
                  <span className="text-sm text-green-600">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Days Logged</span>
                  <span className="text-sm">6/7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Weight Change</span>
                  <span className="text-sm text-green-600">-0.5 lbs</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
