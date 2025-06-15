
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealSharing } from '@/components/Community/MealSharing';
import { NutritionChallenges } from '@/components/Community/NutritionChallenges';
import { Users, Share2, Trophy } from 'lucide-react';

const Community = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Community
        </h1>
      </div>

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meals" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Meal Sharing
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="meals" className="space-y-6">
          <MealSharing />
        </TabsContent>
        
        <TabsContent value="challenges" className="space-y-6">
          <NutritionChallenges />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
