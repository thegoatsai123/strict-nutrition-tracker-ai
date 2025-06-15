
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Settings, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  mealReminders: boolean;
  waterReminders: boolean;
  exerciseReminders: boolean;
  goalAchievements: boolean;
  weeklyReports: boolean;
}

export const PushNotifications: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    mealReminders: true,
    waterReminders: true,
    exerciseReminders: false,
    goalAchievements: true,
    weeklyReports: true
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkRegistration();
    }
  }, []);

  const checkRegistration = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        setIsRegistered(!!registration);
      } catch (error) {
        console.error('Error checking service worker registration:', error);
      }
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not supported",
        description: "This browser doesn't support notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await registerServiceWorker();
        toast({
          title: "Notifications enabled",
          description: "You'll now receive helpful nutrition reminders!",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "You can enable them later in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setIsRegistered(true);
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('NutriTracker Test', {
        body: 'Your notifications are working perfectly! 🎉',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
      
      toast({
        title: "Test notification sent",
        description: "Check if you received it!",
      });
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage
    localStorage.setItem('notification_settings', JSON.stringify({
      ...settings,
      [key]: value
    }));
    
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const scheduleReminder = (type: string, delay: number) => {
    if (permission !== 'granted') return;
    
    setTimeout(() => {
      new Notification(`NutriTracker Reminder`, {
        body: getNotificationMessage(type),
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: type // Prevents duplicate notifications
      });
    }, delay);
  };

  const getNotificationMessage = (type: string) => {
    switch (type) {
      case 'meal': return "Time to log your meal! 🍽️";
      case 'water': return "Don't forget to drink water! 💧";
      case 'exercise': return "Time for some movement! 🏃";
      default: return "NutriTracker reminder";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {permission === 'granted' ? <Bell className="h-5 w-5 text-green-600" /> : <BellOff className="h-5 w-5 text-gray-400" />}
            Push Notifications
          </CardTitle>
          <Badge variant={permission === 'granted' ? "default" : "secondary"}>
            {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Not Set'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission !== 'granted' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Enable notifications to receive helpful reminders about your nutrition goals!
            </p>
            <Button onClick={requestPermission} size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Enable Notifications
            </Button>
          </div>
        )}

        {permission === 'granted' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notification Settings</p>
                <p className="text-sm text-muted-foreground">Customize your reminder preferences</p>
              </div>
              <Button variant="outline" size="sm" onClick={sendTestNotification}>
                Test Notification
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="meal-reminders" className="flex-1">
                  <div>
                    <div className="font-medium">Meal Reminders</div>
                    <div className="text-sm text-muted-foreground">Get reminded to log your meals</div>
                  </div>
                </Label>
                <Switch
                  id="meal-reminders"
                  checked={settings.mealReminders}
                  onCheckedChange={(checked) => updateSetting('mealReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="water-reminders" className="flex-1">
                  <div>
                    <div className="font-medium">Water Reminders</div>
                    <div className="text-sm text-muted-foreground">Stay hydrated throughout the day</div>
                  </div>
                </Label>
                <Switch
                  id="water-reminders"
                  checked={settings.waterReminders}
                  onCheckedChange={(checked) => updateSetting('waterReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="exercise-reminders" className="flex-1">
                  <div>
                    <div className="font-medium">Exercise Reminders</div>
                    <div className="text-sm text-muted-foreground">Get motivated to stay active</div>
                  </div>
                </Label>
                <Switch
                  id="exercise-reminders"
                  checked={settings.exerciseReminders}
                  onCheckedChange={(checked) => updateSetting('exerciseReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="goal-achievements" className="flex-1">
                  <div>
                    <div className="font-medium">Goal Achievements</div>
                    <div className="text-sm text-muted-foreground">Celebrate your successes</div>
                  </div>
                </Label>
                <Switch
                  id="goal-achievements"
                  checked={settings.goalAchievements}
                  onCheckedChange={(checked) => updateSetting('goalAchievements', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-reports" className="flex-1">
                  <div>
                    <div className="font-medium">Weekly Reports</div>
                    <div className="text-sm text-muted-foreground">Get weekly progress summaries</div>
                  </div>
                </Label>
                <Switch
                  id="weekly-reports"
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => scheduleReminder('meal', 5000)}
                  disabled={!settings.mealReminders}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Test Meal Reminder (5s)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => scheduleReminder('water', 3000)}
                  disabled={!settings.waterReminders}
                >
                  <Clock className="mr-1 h-3 w-3" />
                  Test Water Reminder (3s)
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 Tip: Notifications help you stay consistent with your nutrition goals and build healthy habits!</p>
        </div>
      </CardContent>
    </Card>
  );
};
