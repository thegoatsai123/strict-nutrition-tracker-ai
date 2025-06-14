
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      const perm = Notification.permission;
      setPermission({
        granted: perm === 'granted',
        denied: perm === 'denied',
        default: perm === 'default'
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const newPerm = {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
      };
      setPermission(newPerm);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll receive reminders for meals and water intake"
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const scheduleNotification = (title: string, body: string, delay: number) => {
    if (!permission.granted) return;

    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'nutrition-reminder'
      });
    }, delay);
  };

  const scheduleMealReminder = (mealType: string, time: Date) => {
    const now = new Date();
    const delay = time.getTime() - now.getTime();
    
    if (delay > 0) {
      scheduleNotification(
        `${mealType} Reminder`,
        `Don't forget to log your ${mealType.toLowerCase()}!`,
        delay
      );
    }
  };

  const scheduleWaterReminder = (interval: number = 60 * 60 * 1000) => { // 1 hour default
    const reminder = () => {
      scheduleNotification(
        'Water Reminder',
        'Time to drink some water! Stay hydrated.',
        interval
      );
      setTimeout(reminder, interval);
    };
    
    if (permission.granted) {
      setTimeout(reminder, interval);
    }
  };

  return {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleMealReminder,
    scheduleWaterReminder
  };
};
