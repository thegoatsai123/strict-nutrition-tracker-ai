
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Smartphone, Watch, Activity, Heart, Zap, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WearableDevice {
  id: string;
  name: string;
  type: 'fitness_tracker' | 'smartwatch' | 'phone';
  brand: string;
  connected: boolean;
  lastSync: Date | null;
  batteryLevel?: number;
  features: string[];
}

interface HealthMetrics {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate: number;
  sleepHours: number;
  stressLevel: number;
}

export const WearableSync = () => {
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDevices();
    if (autoSync) {
      loadMetrics();
    }
  }, [autoSync]);

  const loadDevices = () => {
    const mockDevices: WearableDevice[] = [
      {
        id: '1',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        brand: 'Apple',
        connected: true,
        lastSync: new Date(),
        batteryLevel: 85,
        features: ['Heart Rate', 'Steps', 'Calories', 'Sleep', 'Workouts']
      },
      {
        id: '2',
        name: 'Fitbit Charge 5',
        type: 'fitness_tracker',
        brand: 'Fitbit',
        connected: false,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        batteryLevel: 92,
        features: ['Heart Rate', 'Steps', 'Calories', 'Sleep', 'Stress']
      },
      {
        id: '3',
        name: 'iPhone Health',
        type: 'phone',
        brand: 'Apple',
        connected: true,
        lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        features: ['Steps', 'Flights Climbed', 'Distance']
      }
    ];
    setDevices(mockDevices);
  };

  const loadMetrics = () => {
    const mockMetrics: HealthMetrics = {
      steps: 8247,
      caloriesBurned: 387,
      activeMinutes: 45,
      heartRate: 72,
      sleepHours: 7.5,
      stressLevel: 3
    };
    setMetrics(mockMetrics);
  };

  const syncDevice = async (deviceId: string) => {
    setSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date(), connected: true }
          : device
      ));
      
      if (autoSync) {
        loadMetrics();
      }
      
      setSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Health data has been updated successfully.",
      });
    }, 2000);
  };

  const connectDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, connected: true, lastSync: new Date() }
        : device
    ));
    
    toast({
      title: "Device Connected",
      description: "Successfully connected to your wearable device.",
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return <Watch className="h-5 w-5" />;
      case 'fitness_tracker': return <Activity className="h-5 w-5" />;
      case 'phone': return <Smartphone className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 2) return 'text-green-500';
    if (level <= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStressLevelText = (level: number) => {
    if (level <= 2) return 'Low';
    if (level <= 4) return 'Moderate';
    return 'High';
  };

  return (
    <div className="space-y-6">
      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Wearable Integration
          </CardTitle>
          <CardDescription>
            Connect your fitness devices to automatically track health metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Auto-sync health data</p>
              <p className="text-sm text-muted-foreground">
                Automatically sync data from connected devices every hour
              </p>
            </div>
            <Switch 
              checked={autoSync} 
              onCheckedChange={setAutoSync}
            />
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getDeviceIcon(device.type)}
                <div>
                  <h4 className="font-semibold">{device.name}</h4>
                  <p className="text-sm text-muted-foreground">{device.brand}</p>
                  {device.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {device.lastSync.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {device.batteryLevel && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Battery: </span>
                    <span className={device.batteryLevel > 20 ? 'text-green-600' : 'text-red-600'}>
                      {device.batteryLevel}%
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {device.connected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <Badge variant={device.connected ? "default" : "secondary"}>
                    {device.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                
                {device.connected ? (
                  <Button 
                    onClick={() => syncDevice(device.id)}
                    size="sm"
                    disabled={syncing}
                  >
                    {syncing ? "Syncing..." : "Sync Now"}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => connectDevice(device.id)}
                    size="sm"
                    variant="outline"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Health Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Today's Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Steps</span>
                  <span className="text-2xl font-bold">{metrics.steps.toLocaleString()}</span>
                </div>
                <Progress value={(metrics.steps / 10000) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 10,000 steps</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Calories Burned</span>
                  <span className="text-2xl font-bold">{metrics.caloriesBurned}</span>
                </div>
                <Progress value={(metrics.caloriesBurned / 500) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 500 calories</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Minutes</span>
                  <span className="text-2xl font-bold">{metrics.activeMinutes}</span>
                </div>
                <Progress value={(metrics.activeMinutes / 60) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 60 minutes</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Heart Rate</span>
                  <span className="text-2xl font-bold">{metrics.heartRate} <span className="text-sm">bpm</span></span>
                </div>
                <p className="text-xs text-muted-foreground">Resting heart rate</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sleep</span>
                  <span className="text-2xl font-bold">{metrics.sleepHours}h</span>
                </div>
                <Progress value={(metrics.sleepHours / 8) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">Goal: 8 hours</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stress Level</span>
                  <span className={`text-2xl font-bold ${getStressLevelColor(metrics.stressLevel)}`}>
                    {getStressLevelText(metrics.stressLevel)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Based on HRV analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
