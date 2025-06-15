import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Camera, Scan, TrendingUp, Award, Target } from "lucide-react";
import { WaterTracker } from "@/components/WaterTracker";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { BarcodeScanner } from "@/components/BarcodeScanner/BarcodeScanner";
import { PhotoFoodRecognition } from "@/components/PhotoFoodRecognition/PhotoFoodRecognition";
import { EnhancedDashboard } from "@/components/Dashboard/EnhancedDashboard";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { AnimatedCard } from "@/components/ui/animated-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";
import { NutritionCoach } from '@/components/Chat/NutritionCoach';

const Index = () => {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showPhotoRecognition, setShowPhotoRecognition] = useState(false);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(73);
  const [weeklyStreak, setWeeklyStreak] = useState(5);
  
  const { permission, requestPermission, scheduleMealReminder, scheduleWaterReminder } = useNotifications();
  const { isChatMinimized, toggleChatMinimize } = useChat();
  const { toast } = useToast();

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

  // Mock current nutrition data - in a real app this would come from today's logged foods
  const currentNutrition = {
    calories: 1650,
    protein: 120,
    carbs: 180,
    fat: 65
  };

  const userGoals = ['Weight loss', 'Muscle building', 'Better energy'];

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in-scale">
      {/* Enhanced Header with Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Track your nutrition journey with smart insights</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4">
          <AnimatedCard className="p-4 min-w-[120px]" animationDelay={100}>
            <div className="flex items-center gap-3">
              <ProgressRing progress={dailyGoalProgress} size={50} strokeWidth={4}>
                <span className="text-xs font-bold">{dailyGoalProgress}%</span>
              </ProgressRing>
              <div>
                <p className="text-sm font-medium">Daily Goal</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
            </div>
          </AnimatedCard>
          
          <AnimatedCard className="p-4 min-w-[120px]" animationDelay={200}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{weeklyStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        {!permission.granted && permission.default && (
          <Button variant="outline" onClick={requestPermission} className="hover-lift">
            Enable Smart Notifications
          </Button>
        )}
        
        <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
          <DialogTrigger asChild>
            <Button variant="outline" className="hover-lift">
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
            <Button variant="outline" className="hover-lift">
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

        <Button asChild className="hover-lift ripple">
          <Link to="/log-food">
            <Plus className="mr-2 h-4 w-4" />
            Log Food
          </Link>
        </Button>
      </div>

      {/* Enhanced Real-time Dashboard */}
      <div className="animate-slide-in-up" style={{ animationDelay: '300ms' }}>
        <EnhancedDashboard />
      </div>

      {/* AI Nutrition Coach */}
      <div className="animate-slide-in-up" style={{ animationDelay: '400ms' }}>
        <NutritionCoach 
          userGoals={userGoals}
          currentNutrition={currentNutrition}
        />
      </div>

      {/* Quick Actions & Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-in-up" style={{ animationDelay: '500ms' }}>
          <WaterTracker />
        </div>
        <div className="animate-slide-in-up" style={{ animationDelay: '600ms' }}>
          <ExerciseTracker />
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        isMinimized={isChatMinimized} 
        onToggleMinimize={toggleChatMinimize} 
      />
    </div>
  );
};

export default Index;
