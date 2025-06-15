
import { supabase } from '@/integrations/supabase/client';

interface OfflineEntry {
  id: string;
  type: 'food_log' | 'water_intake' | 'exercise' | 'goal_update';
  data: any;
  timestamp: string;
  synced: boolean;
  retryCount: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline = navigator.onLine;
  private syncQueue: OfflineEntry[] = [];
  private maxRetries = 3;
  private syncInProgress = false;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  constructor() {
    this.loadOfflineData();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Periodic sync when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncOfflineData();
      }
    }, 30000); // Every 30 seconds
  }

  async addEntry(type: string, data: any): Promise<void> {
    const entry: OfflineEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: type as any,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
      retryCount: 0
    };

    this.syncQueue.push(entry);
    this.saveOfflineData();

    // Try immediate sync if online
    if (this.isOnline) {
      await this.syncEntry(entry);
    }
  }

  async syncOfflineData(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress || !this.isOnline) {
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let successCount = 0;
    let failedCount = 0;

    const unsyncedEntries = this.syncQueue.filter(entry => !entry.synced);

    for (const entry of unsyncedEntries) {
      try {
        const success = await this.syncEntry(entry);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        console.error('Sync error for entry:', entry.id, error);
        failedCount++;
      }
    }

    this.syncInProgress = false;
    this.saveOfflineData();
    
    return { success: successCount, failed: failedCount };
  }

  private async syncEntry(entry: OfflineEntry): Promise<boolean> {
    try {
      let result;

      switch (entry.type) {
        case 'food_log':
          result = await supabase
            .from('food_logs')
            .insert(entry.data);
          break;

        case 'water_intake':
          result = await supabase
            .from('water_intake')
            .upsert(entry.data);
          break;

        case 'exercise':
          result = await supabase
            .from('exercise_logs')
            .insert(entry.data);
          break;

        case 'goal_update':
          result = await supabase
            .from('nutrition_goals')
            .upsert(entry.data);
          break;

        default:
          console.warn('Unknown entry type:', entry.type);
          return false;
      }

      if (result.error) {
        throw result.error;
      }

      entry.synced = true;
      return true;

    } catch (error) {
      console.error('Failed to sync entry:', entry.id, error);
      entry.retryCount++;
      
      // Remove entries that have failed too many times
      if (entry.retryCount >= this.maxRetries) {
        this.removeEntry(entry.id);
      }
      
      return false;
    }
  }

  private removeEntry(entryId: string) {
    this.syncQueue = this.syncQueue.filter(entry => entry.id !== entryId);
    this.saveOfflineData();
  }

  private loadOfflineData() {
    try {
      const stored = localStorage.getItem('offline_sync_queue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
      this.syncQueue = [];
    }
  }

  private saveOfflineData() {
    try {
      localStorage.setItem('offline_sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  getQueueStatus() {
    const unsynced = this.syncQueue.filter(entry => !entry.synced).length;
    const total = this.syncQueue.length;
    
    return {
      unsynced,
      total,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }

  clearSyncedEntries() {
    this.syncQueue = this.syncQueue.filter(entry => !entry.synced);
    this.saveOfflineData();
  }
}

export const offlineManager = OfflineManager.getInstance();
