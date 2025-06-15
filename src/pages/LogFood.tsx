
import React, { useEffect } from 'react';
import { FoodLogger } from '@/components/FoodLogger/FoodLogger';
import { useEnhancedOffline } from '@/hooks/useEnhancedOffline';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, RefreshCw, Clock } from 'lucide-react';

const LogFood = () => {
  const { queueStatus, lastSyncTime, syncData, isOnline, pendingSync } = useEnhancedOffline();

  // Listen for food recognition events and add to offline queue
  useEffect(() => {
    const handleFoodFromRecognition = async (event: CustomEvent) => {
      const { addOfflineEntry } = useEnhancedOffline();
      await addOfflineEntry('food_log', {
        ...event.detail,
        user_id: 'current_user', // Would get from auth context
        consumed_at: new Date().toISOString()
      });
    };

    window.addEventListener('add-food-from-recognition', handleFoodFromRecognition as EventListener);
    
    return () => {
      window.removeEventListener('add-food-from-recognition', handleFoodFromRecognition as EventListener);
    };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Offline Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Log Food</h1>
          <p className="text-gray-600 mt-2">Track your meals and nutrition</p>
        </div>
        
        {/* Offline Status */}
        <Card className={`${!isOnline ? 'border-yellow-500 bg-yellow-50' : ''}`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>
              {pendingSync > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingSync} pending
                </Badge>
              )}
            </div>
            
            {lastSyncTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </div>
            )}
            
            {isOnline && pendingSync > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={syncData}
                className="mt-2 h-6 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Offline Warning */}
      {!isOnline && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <WifiOff className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Working Offline
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  No internet connection detected. All your food logs will be saved locally 
                  and automatically synced when you're back online. Enhanced AI features 
                  may be limited in offline mode.
                </p>
                {pendingSync > 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    {pendingSync} entries waiting to sync
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main Food Logger */}
      <FoodLogger />
    </div>
  );
};

export default LogFood;
