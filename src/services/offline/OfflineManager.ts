
import { supabase } from '@/integrations/supabase/client';

interface OfflineEntry {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

interface QueueStatus {
  total: number;
  unsynced: number;
  isOnline: boolean;
}

interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

class OfflineManager {
  private dbName = 'nutritracker_offline';
  private version = 1;
  private db: IDBDatabase | null = null;
  private maxRetries = 3;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('entries')) {
          const store = db.createObjectStore('entries', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async addEntry(type: string, data: any): Promise<void> {
    if (!this.db) await this.initialize();
    
    const entry: OfflineEntry = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readwrite');
      const store = transaction.objectStore('entries');
      const request = store.add(entry);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsynced(): Promise<OfflineEntry[]> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readonly');
      const store = transaction.objectStore('entries');
      const index = store.index('synced');
      const request = index.getAll(false);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.initialize();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readwrite');
      const store = transaction.objectStore('entries');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const entry = getRequest.result;
        if (entry) {
          entry.synced = true;
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async syncOfflineData(): Promise<SyncResult> {
    const result: SyncResult = { success: 0, failed: 0, errors: [] };
    
    try {
      const entries = await this.getUnsynced();
      
      for (const entry of entries) {
        try {
          await this.syncEntry(entry);
          await this.markAsSynced(entry.id);
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to sync ${entry.type}: ${error}`);
          
          // Increment retry count
          await this.incrementRetryCount(entry.id);
        }
      }
    } catch (error) {
      result.errors.push(`Sync process failed: ${error}`);
    }
    
    return result;
  }

  private async syncEntry(entry: OfflineEntry): Promise<void> {
    switch (entry.type) {
      case 'food_log':
        return this.syncFoodLog(entry.data);
      case 'water_intake':
        return this.syncWaterIntake(entry.data);
      case 'exercise':
        return this.syncExercise(entry.data);
      default:
        throw new Error(`Unknown entry type: ${entry.type}`);
    }
  }

  private async syncFoodLog(data: any): Promise<void> {
    const { error } = await supabase
      .from('food_logs')
      .insert(data);
    
    if (error) throw error;
  }

  private async syncWaterIntake(data: any): Promise<void> {
    const { error } = await supabase
      .from('water_intake')
      .insert(data);
    
    if (error) throw error;
  }

  private async syncExercise(data: any): Promise<void> {
    const { error } = await supabase
      .from('exercises')
      .insert(data);
    
    if (error) throw error;
  }

  private async incrementRetryCount(id: string): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['entries'], 'readwrite');
      const store = transaction.objectStore('entries');
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const entry = getRequest.result;
        if (entry && entry.retryCount < this.maxRetries) {
          entry.retryCount++;
          const putRequest = store.put(entry);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  getQueueStatus(): QueueStatus {
    return {
      total: 0, // Will be updated by useEnhancedOffline hook
      unsynced: 0, // Will be updated by useEnhancedOffline hook
      isOnline: navigator.onLine
    };
  }

  clearSyncedEntries(): void {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['entries'], 'readwrite');
    const store = transaction.objectStore('entries');
    const index = store.index('synced');
    const request = index.openCursor(true);
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }
}

export const offlineManager = new OfflineManager();
