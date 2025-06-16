
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Zap, Brain, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodRecognitionResult {
  name: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  portion: string;
}

export const AdvancedFoodRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FoodRecognitionResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const { toast } = useToast();

  const processImage = async (imageFile: File) => {
    setIsProcessing(true);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(imageFile);

    // Simulate AI processing
    setTimeout(() => {
      const mockResults: FoodRecognitionResult[] = [
        {
          name: 'Grilled Chicken Breast',
          confidence: 95,
          nutrition: { calories: 231, protein: 43.5, carbs: 0, fat: 5 },
          portion: '1 medium piece (150g)'
        },
        {
          name: 'Steamed Broccoli',
          confidence: 88,
          nutrition: { calories: 25, protein: 3, carbs: 5, fat: 0.3 },
          portion: '1 cup (90g)'
        },
        {
          name: 'Brown Rice',
          confidence: 92,
          nutrition: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
          portion: '1/2 cup cooked (98g)'
        }
      ];
      
      setResults(mockResults);
      setIsProcessing(false);
      
      toast({
        title: "Food Recognition Complete!",
        description: `Identified ${mockResults.length} food items with high confidence.`,
      });
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please try uploading an image instead.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            processImage(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const addToFoodLog = (result: FoodRecognitionResult) => {
    toast({
      title: "Added to Food Log",
      description: `${result.name} has been added to your meal log.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Food Recognition
          </CardTitle>
          <CardDescription>
            Advanced AI-powered food identification and nutritional analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cameraActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-24 flex-col gap-2"
                disabled={isProcessing}
              >
                <Upload className="h-6 w-6" />
                Upload Photo
              </Button>
              
              <Button
                onClick={startCamera}
                variant="outline"
                className="h-24 flex-col gap-2"
                disabled={isProcessing}
              >
                <Camera className="h-6 w-6" />
                Use Camera
              </Button>
            </div>
          )}

          {cameraActive && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {isProcessing && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="animate-pulse flex justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">AI Processing Your Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyzing food items and calculating nutrition...
                  </p>
                  <Progress value={undefined} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {selectedImage && (
            <div className="mt-4">
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              Recognition Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{result.name}</h4>
                  <Badge 
                    variant={result.confidence > 90 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {result.confidence}% confident
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{result.portion}</p>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium">{result.nutrition.calories}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.nutrition.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.nutrition.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{result.nutrition.fat}g</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => addToFoodLog(result)}
                  className="w-full"
                  size="sm"
                >
                  Add to Food Log
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
