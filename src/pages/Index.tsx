
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, TrendingUp, Target, Plus, Clock, Camera, Scan } from "lucide-react";
import { WaterTracker } from "@/components/WaterTracker";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { BarcodeScanner } from "@/components/BarcodeScanner/BarcodeScanner";
import { PhotoFoodRecognition } from "@/components/PhotoFoodRecognition/PhotoFoodRecognition";
import { dummyTodayStats, dummyRecentMeals, dummyWeeklyProgress } from "@/data/dummyData";
import { IDummyRecipe } from "@/types/dummyTypes";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [recipes, setRecipes] = useState<IDummyRecipe[]>([]);
  const [todayStats, setTodayStats] = useState(dummyTodayStats);
  const [recentMeals, setRecentMeals] = useState(dummyRecentMeals);
  const [weeklyProgress, setWeeklyProgress] = useState(dummyWeeklyProgress);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showPhotoRecognition, setShowPhotoRecognition] = useState(false);
  
  const { permission, requestPermission, scheduleMealReminder, scheduleWaterReminder } = useNotifications();
  const { toast } = useToast();

  const calorieProgress = (todayStats.calories / todayStats.calorieGoal) * 100;
  const proteinProgress = (todayStats.protein / todayStats.proteinGoal) * 100;

  useEffect(() => {
    // Schedule notifications if permission is granted
    if (permission.granted) {
      scheduleWaterReminder(2 * 60 * 60 * 1000); // Every 2 hours
      
      // Schedule meal reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // 8 AM breakfast reminder
      scheduleMealReminder('Breakfast', tomorrow);
    }
  }, [permission.granted]);

  const handleBarcodeScanned = (barcode: string) => {
    toast({
      title: "Barcode Scanned",
      description: `Barcode: ${barcode}`,
    });
    setShowBarcodeScanner(false);
    // Here you would typically search for the food using the barcode
  };

  const handleFoodRecognized = (predictions: Array<{ className: string; confidence: number }>) => {
    toast({
      title: "Food Recognized",
      description: `Found: ${predictions[0]?.className}`,
    });
    setShowPhotoRecognition(false);
    // Here you would typically add the recognized food to the log
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          {!permission.granted && permission.default && (
            <Button variant="outline" onClick={requestPermission}>
              Enable Notifications
            </Button>
          )}
          <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Scan className="mr-2 h-4 w-4" />
                Scan Barcode
              </Button>
            </DialogTrigger>
            <DialogContent>
              <BarcodeScanner 
                onScan={handleBarcodeScanned}
                onClose={() => setShowBarcodeScanner(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPhotoRecognition} onOpenChange={setShowPhotoRecognition}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Photo Recognition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <PhotoFoodRecognition 
                onFoodRecognized={handleFoodRecognized}
                onClose={() => setShowPhotoRecognition(false)}
              />
            </DialogContent>
          </Dialog>

          <Button asChild>
            <Link to="/log-food">
              <Plus className="mr-2 h-4 w-4" />
              Log Food
            </Link>
          </Button>
        </div>
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
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Summary</CardTitle>
            <Button variant="outline" asChild>
              <Link to="/analytics">View Analytics</Link>
            </Button>
          </div>
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
