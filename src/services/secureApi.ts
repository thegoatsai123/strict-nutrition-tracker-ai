
import { supabase } from '@/integrations/supabase/client';
import { rateLimiter } from '@/utils/security';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

export class SecureApiService {
  private static instance: SecureApiService;
  private requestQueue: Map<string, Promise<any>> = new Map();

  public static getInstance(): SecureApiService {
    if (!SecureApiService.instance) {
      SecureApiService.instance = new SecureApiService();
    }
    return SecureApiService.instance;
  }

  // Debounced API calls to prevent spam
  private async makeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    maxRequests: number = 10,
    windowMs: number = 60000
  ): Promise<T> {
    // Check rate limiting
    if (!rateLimiter.isAllowed(key, maxRequests, windowMs)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Check if the same request is already in progress
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key);
    }

    const request = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, request);
    return request;
  }

  async callNutritionAPI(action: string, params: any, userId?: string): Promise<any> {
    const requestKey = `nutrition_${action}_${userId || 'anonymous'}`;
    
    return this.makeRequest(requestKey, async () => {
      // Validate user session for authenticated requests
      if (userId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.id !== userId) {
          throw new Error('Unauthorized: Invalid session');
        }
      }

      const { data, error } = await supabase.functions.invoke('nutrition-api', {
        body: { 
          action, 
          ...params,
          // Add timestamp for cache busting
          timestamp: Date.now()
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'API request failed');
      }

      return data;
    });
  }

  // Secure database operations with validation
  async insertRecord(
    table: TableName, 
    data: Record<string, any>, 
    userId: string,
    validateFn?: (data: any) => boolean
  ): Promise<any> {
    // Validate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== userId) {
      throw new Error('Unauthorized: Invalid session');
    }

    // Apply custom validation if provided
    if (validateFn && !validateFn(data)) {
      throw new Error('Data validation failed');
    }

    // Ensure user_id is set correctly
    const secureData = {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from(table)
      .insert(secureData)
      .select()
      .single();

    if (error) {
      console.error(`Insert error for table ${table}:`, error);
      throw new Error(`Failed to insert record: ${error.message}`);
    }

    return result;
  }

  async updateRecord(
    table: TableName,
    id: string,
    data: Record<string, any>,
    userId: string
  ): Promise<any> {
    // Validate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== userId) {
      throw new Error('Unauthorized: Invalid session');
    }

    const secureData = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await (supabase
      .from(table as any)
      .update(secureData)
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only update their own records
      .select()
      .single());

    if (error) {
      console.error(`Update error for table ${table}:`, error);
      throw new Error(`Failed to update record: ${error.message}`);
    }

    return result;
  }

  async deleteRecord(table: TableName, id: string, userId: string): Promise<void> {
    // Validate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== userId) {
      throw new Error('Unauthorized: Invalid session');
    }

    const { error } = await supabase
      .from(table as any)
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user can only delete their own records

    if (error) {
      console.error(`Delete error for table ${table}:`, error);
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }

  async fetchUserRecords(
    table: TableName,
    userId: string,
    options?: {
      columns?: string;
      filters?: Record<string, any>;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<any[]> {
    // Validate user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== userId) {
      throw new Error('Unauthorized: Invalid session');
    }

    let query = supabase
      .from(table as any)
      .select(options?.columns || '*')
      .eq('user_id', userId);

    // Apply additional filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending ?? false 
      });
    }

    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Fetch error for table ${table}:`, error);
      throw new Error(`Failed to fetch records: ${error.message}`);
    }

    return data || [];
  }
}

export const secureApiService = SecureApiService.getInstance();
