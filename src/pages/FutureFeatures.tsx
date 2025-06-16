
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartRecommendations } from '@/components/AI/SmartRecommendations';
import { AchievementSystem } from '@/components/Achievements/AchievementSystem';
import { AdvancedFoodRecognition } from '@/components/FoodRecognition/AdvancedFoodRecognition';
import { WearableSync } from '@/components/Integration/WearableSync';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Trophy, Camera, Watch, Sparkles } from 'lucide-react';

const FutureFeatures = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Future Features Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the next generation of nutrition tracking with AI-powered insights, 
          gamification, advanced food recognition, and seamless device integration.
        </p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="recognition" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Food Recognition
          </TabsTrigger>
          <TabsTrigger value="wearables" className="flex items-center gap-2">
            <Watch className="h-4 w-4" />
            Wearables
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                AI-Powered Nutrition Intelligence
              </CardTitle>
              <CardDescription>
                Advanced machine learning algorithms analyze your nutrition patterns and provide 
                personalized recommendations to optimize your health goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartRecommendations />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                Gamified Nutrition Journey
              </CardTitle>
              <CardDescription>
                Stay motivated with achievements, levels, and points that make healthy eating fun and rewarding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AchievementSystem />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recognition" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-green-500" />
                Next-Gen Food Recognition
              </CardTitle>
              <CardDescription>
                State-of-the-art computer vision technology instantly identifies food items and calculates 
                precise nutritional information from photos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedFoodRecognition />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wearables" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Watch className="h-6 w-6 text-blue-500" />
                Seamless Device Integration
              </CardTitle>
              <CardDescription>
                Connect with popular fitness trackers and smartwatches to automatically sync health metrics 
                and create a complete picture of your wellness journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WearableSync />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Future Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Here's what's planned for the next releases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-purple-600">Voice Commands</h4>
              <p className="text-sm text-muted-foreground">
                "Hey NutriTracker, I just ate a banana" - hands-free food logging
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-blue-600">Meal Planning AI</h4>
              <p className="text-sm text-muted-foreground">
                AI generates personalized meal plans based on your preferences and goals
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-green-600">Restaurant Integration</h4>
              <p className="text-sm text-muted-foreground">
                Real-time menu nutritional data from partnered restaurants
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-orange-600">Grocery Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Auto-generate shopping lists and integrate with delivery services
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-red-600">Health Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Connect with blood glucose meters and other health devices
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-semibold text-indigo-600">Family Plans</h4>
              <p className="text-sm text-muted-foreground">
                Manage nutrition for your entire family from one dashboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FutureFeatures;
