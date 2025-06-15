
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealTimeUpdates = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for food logs
    const foodLogsChannel = supabase
      .channel('food-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Food log change:', payload);
          // Trigger re-fetch of food logs
          window.dispatchEvent(new CustomEvent('food-logs-updated', { detail: payload }));
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Set up real-time subscription for water intake
    const waterChannel = supabase
      .channel('water-intake-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'water_intake',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Water intake change:', payload);
          window.dispatchEvent(new CustomEvent('water-intake-updated', { detail: payload }));
        }
      )
      .subscribe();

    // Set up real-time subscription for progress
    const progressChannel = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Progress change:', payload);
          window.dispatchEvent(new CustomEvent('progress-updated', { detail: payload }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(foodLogsChannel);
      supabase.removeChannel(waterChannel);
      supabase.removeChannel(progressChannel);
    };
  }, [user]);

  return { isConnected };
};
