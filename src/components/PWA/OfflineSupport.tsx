
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi, Download, Sync, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  id: string;
  type: 'food_log' | 'water_intake' | 'exercise';
  data: any;
  timestamp: string;
  synced: boolean;
}

export const OfflineSupport: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection restored",
        description: "You're back online! Syncing data...",
      });
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry! Your data will be saved locally and synced when you're back online.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    const stored = localStorage.getItem('offline_data');
    if (stored) {
      setOfflineData(JSON.parse(stored));
    }
  };

  const saveOfflineData = (data: OfflineData[]) => {
    localStorage.setItem('offline_data', JSON.stringify(data));
    setOfflineData(data);
  };

  const addOfflineEntry = (type: string, data: any) => {
    const newEntry: OfflineData = {
      id: Date.now().toString(),
      type: type as any,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    };

    const updated = [...offlineData, newEntry];
    saveOfflineData(updated);

    toast({
      title: "Data saved offline",
      description: "Your entry has been saved locally and will sync when you're online.",
    });
  };

  const syncOfflineData = async () => {
    if (!isOnline || syncInProgress) return;

    setSyncInProgress(true);
    try {
      const unsyncedData = offlineData.filter(item => !item.synced);
      
      for (const item of unsyncedData) {
        // Mock sync - in real app would sync to Supabase
        console.log('Syncing offline data:', item);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        
        item.synced = true;
      }

      saveOfflineData(offlineData);
      
      if (unsyncedData.length > 0) {
        toast({
          title: "Sync complete",
          description: `Successfully synced ${unsyncedData.length} offline entries.`,
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync some offline data. Will retry automatically.",
        variant: "destructive",
      });
    } finally {
      setSyncInProgress(false);
    }
  };

  const clearSyncedData = () => {
    const unsyncedData = offlineData.filter(item => !item.synced);
    saveOfflineData(unsyncedData);
    
    toast({
      title: "Synced data cleared",
      description: "Successfully cleared synced offline data.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'food_log': return '🍽️';
      case 'water_intake': return '💧';
      case 'exercise': return '🏃';
      default: return '📝';
    }
  };

  const unsyncedCount = offlineData.filter(item => !item.synced).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
            Offline Support
          </CardTitle>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {unsyncedCount > 0 ? `${unsyncedCount} entries pending sync` : 'All data synced'}
            </p>
            <p className="text-xs text-muted-foreground">
              {offlineData.length} total offline entries
            </p>
          </div>
          <div className="flex gap-2">
            {isOnline && unsyncedCount > 0 && (
              <Button 
                size="sm" 
                onClick={syncOfflineData}
                disabled={syncInProgress}
              >
                {syncInProgress ? <Sync className="mr-1 h-3 w-3 animate-spin" /> : <Sync className="mr-1 h-3 w-3" />}
                Sync Now
              </Button>
            )}
            {offlineData.filter(item => item.synced).length > 0 && (
              <Button variant="outline" size="sm" onClick={clearSyncedData}>
                Clear Synced
              </Button>
            )}
          </div>
        </div>

        {!isOnline && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You're currently offline. Your data will be saved locally and synced automatically when you reconnect.
              </p>
            </div>
          </div>
        )}

        {offlineData.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Offline Entries</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {offlineData.slice(-10).reverse().map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(item.type)}</span>
                    <div>
                      <div className="font-medium capitalize">{item.type.replace('_', ' ')}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={item.synced ? "default" : "secondary"}>
                    {item.synced ? "Synced" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 Tip: The app works fully offline. Log your meals, track water, and record exercises even without internet!</p>
        </div>
      </CardContent>
    </Card>
  );
};
