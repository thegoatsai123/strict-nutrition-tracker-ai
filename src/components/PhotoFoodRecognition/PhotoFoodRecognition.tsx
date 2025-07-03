
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FoodPrediction {
  className: string;
  confidence: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface PhotoFoodRecognitionProps {
  onFoodRecognized: (predictions: FoodPrediction[]) => void;
  onClose: () => void;
}

export const PhotoFoodRecognition: React.FC<PhotoFoodRecognitionProps> = ({ onFoodRecognized, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<FoodPrediction[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPredictions([]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Simulate food recognition with more realistic data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPredictions: FoodPrediction[] = [
        {
          className: 'Grilled Chicken Breast',
          confidence: 0.92,
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6
        },
        {
          className: 'Mixed Vegetables',
          confidence: 0.85,
          calories: 50,
          protein: 2,
          carbs: 10,
          fat: 0.5
        }
      ];
      
      setPredictions(mockPredictions);
      onFoodRecognized(mockPredictions);
      
      toast({
        title: "Food Recognition Complete! 🎉",
        description: `Identified ${mockPredictions.length} food items. You can now add them to your food log.`
      });
    } catch (error) {
      console.error('Food recognition error:', error);
      toast({
        title: "Recognition Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToFoodLog = async (prediction: FoodPrediction) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to log food items.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          fdc_id: Math.floor(Math.random() * 100000), // Temporary ID
          food_description: prediction.className,
          quantity: 1,
          unit: 'serving',
          meal_type: 'snack',
          consumed_at: new Date().toISOString(),
          calories: prediction.calories || 100,
          protein: prediction.protein || 5,
          carbohydrates: prediction.carbs || 15,
          fat: prediction.fat || 3
        });

      if (error) throw error;

      toast({
        title: "Added to Food Log! ✅",
        description: `${prediction.className} has been logged successfully.`
      });

      // Trigger a refresh of the dashboard
      window.dispatchEvent(new CustomEvent('food-logs-updated'));
      
    } catch (error) {
      console.error('Error adding to food log:', error);
      toast({
        title: "Error",
        description: "Failed to add food to log. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setPredictions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Food Recognition
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!previewUrl ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Take a photo or upload an image of your food
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Selected food"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={analyzeImage} 
                disabled={isAnalyzing} 
                className="flex-1"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
              </Button>
              <Button variant="outline" onClick={resetImage}>
                Reset
              </Button>
            </div>

            {predictions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Recognized Foods:</h4>
                {predictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{prediction.className}</h5>
                        <Badge variant="secondary" className="mt-1">
                          {Math.round(prediction.confidence * 100)}% confident
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addToFoodLog(prediction)}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Log
                      </Button>
                    </div>
                    
                    {prediction.calories && (
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <p className="font-medium text-orange-600">{prediction.calories}</p>
                          <p className="text-muted-foreground">Calories</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-600">{prediction.protein}g</p>
                          <p className="text-muted-foreground">Protein</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">{prediction.carbs}g</p>
                          <p className="text-muted-foreground">Carbs</p>
                        </div>
                        <div>
                          <p className="font-medium text-purple-600">{prediction.fat}g</p>
                          <p className="text-muted-foreground">Fat</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
