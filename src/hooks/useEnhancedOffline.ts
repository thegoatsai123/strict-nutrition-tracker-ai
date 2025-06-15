
import { useState, useEffect, useCallback } from 'react';
import { offlineManager } from '@/services/offline/OfflineManager';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedOffline = () => {
  const [queueStatus, setQueueStatus] = useState(offlineManager.getQueueStatus());
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const updateStatus = useCallback(() => {
    setQueueStatus(offlineManager.getQueueStatus());
  }, []);

  useEffect(() => {
    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);
    
    // Listen for online/offline events
    const handleOnline = () => {
      updateStatus();
      toast({
        title: "Back Online! 🌐",
        description: "Syncing your offline data...",
      });
      syncData();
    };

    const handleOffline = () => {
      updateStatus();
      toast({
        title: "Offline Mode Active 📱",
        description: "Your data will be saved locally and synced later.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const addOfflineEntry = useCallback(async (type: string, data: any) => {
    try {
      await offlineManager.addEntry(type, data);
      updateStatus();
      
      if (!queueStatus.isOnline) {
        toast({
          title: "Saved Offline ✓",
          description: "Your data has been saved locally and will sync when online.",
        });
      }
    } catch (error) {
      console.error('Failed to add offline entry:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save data offline. Please try again.",
        variant: "destructive",
      });
    }
  }, [queueStatus.isOnline, toast, updateStatus]);

  const syncData = useCallback(async () => {
    try {
      const result = await offlineManager.syncOfflineData();
      setLastSyncTime(new Date());
      updateStatus();
      
      if (result.success > 0) {
        toast({
          title: "Sync Complete ✓",
          description: `Successfully synced ${result.success} items${result.failed > 0 ? `, ${result.failed} failed` : ''}.`,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Some items couldn't be synced. Will retry automatically.",
        variant: "destructive",
      });
      return { success: 0, failed: queueStatus.unsynced };
    }
  }, [toast, updateStatus, queueStatus.unsynced]);

  const clearSyncedData = useCallback(() => {
    offlineManager.clearSyncedEntries();
    updateStatus();
    toast({
      title: "Cleared Synced Data",
      description: "Local synced data has been cleared to free up space.",
    });
  }, [toast, updateStatus]);

  return {
    queueStatus,
    lastSyncTime,
    addOfflineEntry,
    syncData,
    clearSyncedData,
    isOnline: queueStatus.isOnline,
    pendingSync: queueStatus.unsynced,
    totalEntries: queueStatus.total
  };
};
