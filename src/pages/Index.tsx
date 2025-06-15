
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Camera, Scan } from "lucide-react";
import { WaterTracker } from "@/components/WaterTracker";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { BarcodeScanner } from "@/components/BarcodeScanner/BarcodeScanner";
import { PhotoFoodRecognition } from "@/components/PhotoFoodRecognition/PhotoFoodRecognition";
import { RealTimeDashboard } from "@/components/RealTimeDashboard/RealTimeDashboard";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showPhotoRecognition, setShowPhotoRecognition] = useState(false);
  
  const { permission, requestPermission, scheduleMealReminder, scheduleWaterReminder } = useNotifications();
  const { isChatMinimized, toggleChatMinimize } = useChat();
  const { toast } = useToast();

  useEffect(() => {
    // Schedule notifications if permission is granted
    if (permission.granted) {
      scheduleWaterReminder(2 * 60 * 60 * 1000); // Every 2 hours
      
      // Schedule meal reminders
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0); // 8 AM breakfast reminder
      scheduleMealReminder('Breakfast', tomorrow);
    }
  }, [permission.granted]);

  const handleBarcodeScanned = (barcode: string) => {
    toast({
      title: "Barcode Scanned",
      description: `Barcode: ${barcode}`,
    });
    setShowBarcodeScanner(false);
    // Here you would typically search for the food using the barcode
  };

  const handleFoodRecognized = (predictions: Array<{ className: string; confidence: number }>) => {
    toast({
      title: "Food Recognized",
      description: `Found: ${predictions[0]?.className}`,
    });
    setShowPhotoRecognition(false);
    // Here you would typically add the recognized food to the log
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          {!permission.granted && permission.default && (
            <Button variant="outline" onClick={requestPermission}>
              Enable Notifications
            </Button>
          )}
          <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Scan className="mr-2 h-4 w-4" />
                Scan Barcode
              </Button>
            </DialogTrigger>
            <DialogContent>
              <BarcodeScanner 
                onScan={handleBarcodeScanned}
                onClose={() => setShowBarcodeScanner(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showPhotoRecognition} onOpenChange={setShowPhotoRecognition}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Photo Recognition
              </Button>
            </DialogTrigger>
            <DialogContent>
              <PhotoFoodRecognition 
                onFoodRecognized={handleFoodRecognized}
                onClose={() => setShowPhotoRecognition(false)}
              />
            </DialogContent>
          </Dialog>

          <Button asChild>
            <Link to="/log-food">
              <Plus className="mr-2 h-4 w-4" />
              Log Food
            </Link>
          </Button>
        </div>
      </div>

      {/* Real-time Dashboard */}
      <RealTimeDashboard />

      {/* Quick Actions & Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterTracker />
        <ExerciseTracker />
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        isMinimized={isChatMinimized} 
        onToggleMinimize={toggleChatMinimize} 
      />
    </div>
  );
};

export default Index;
