
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Target, Plus, Clock } from "lucide-react";
import { WaterTracker } from "@/components/WaterTracker";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { dummyTodayStats, dummyRecentMeals, dummyWeeklyProgress } from "@/data/dummyData";
import { IDummyRecipe } from "@/types/dummyTypes";
import { Link } from "react-router-dom";

const Index = () => {
  const [recipes, setRecipes] = useState<IDummyRecipe[]>([]);
  const [todayStats, setTodayStats] = useState(dummyTodayStats);
  const [recentMeals, setRecentMeals] = useState(dummyRecentMeals);
  const [weeklyProgress, setWeeklyProgress] = useState(dummyWeeklyProgress);

  const calorieProgress = (todayStats.calories / todayStats.calorieGoal) * 100;
  const proteinProgress = (todayStats.protein / todayStats.proteinGoal) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/log-food">
            <Plus className="mr-2 h-4 w-4" />
            Log Food
          </Link>
        </Button>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.calories}</div>
            <p className="text-xs text-muted-foreground">of {todayStats.calorieGoal} goal</p>
            <Progress value={calorieProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.protein}g</div>
            <p className="text-xs text-muted-foreground">of {todayStats.proteinGoal}g goal</p>
            <Progress value={proteinProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.carbs}g</div>
            <p className="text-xs text-muted-foreground">of {todayStats.carbGoal}g goal</p>
            <Progress value={(todayStats.carbs / todayStats.carbGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.fat}g</div>
            <p className="text-xs text-muted-foreground">of {todayStats.fatGoal}g goal</p>
            <Progress value={(todayStats.fat / todayStats.fatGoal) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterTracker />
        <ExerciseTracker />
      </div>

      {/* Recent Meals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{meal.meal}</div>
                  <div className="text-sm text-muted-foreground">{meal.description}</div>
                  <div className="text-xs text-muted-foreground">{meal.time}</div>
                </div>
                <Badge variant="secondary">{meal.calories} cal</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{weeklyProgress.averageCalories}</div>
              <div className="text-sm text-muted-foreground">Avg Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyProgress.proteinGoalAchievement}%</div>
              <div className="text-sm text-muted-foreground">Protein Goal</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyProgress.daysLogged}/{weeklyProgress.totalDays}</div>
              <div className="text-sm text-muted-foreground">Days Logged</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{weeklyProgress.weightChange > 0 ? '+' : ''}{weeklyProgress.weightChange} kg</div>
              <div className="text-sm text-muted-foreground">Weight Change</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
