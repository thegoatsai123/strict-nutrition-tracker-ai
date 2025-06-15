
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PushNotifications } from '@/components/PWA/PushNotifications';
import { OfflineSupport } from '@/components/PWA/OfflineSupport';
import { PWAPrompt } from '@/components/PWA/PWAPrompt';
import { Settings as SettingsIcon, Bell, Wifi, Smartphone } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="offline" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Offline
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-6">
          <PushNotifications />
        </TabsContent>
        
        <TabsContent value="offline" className="space-y-6">
          <OfflineSupport />
        </TabsContent>
        
        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PWAPrompt />
              <div className="text-sm text-muted-foreground">
                <p>💡 Install the app on your device for the best mobile experience!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
