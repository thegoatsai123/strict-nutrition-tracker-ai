
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, Brain, Zap, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { modelManager } from '@/services/mlModels/ModelManager';
import { EnhancedNutritionCalculator } from '@/services/nutrition/EnhancedNutritionCalculator';

interface DetectedFood {
  name: string;
  confidence: number;
  portion: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const EnhancedFoodRecognition: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [processingStage, setProcessingStage] = useState('');
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setDetectedFoods([]);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setDetectedFoods([]);
    
    try {
      // Stage 1: ML Model Recognition
      setProcessingStage('Running AI food recognition...');
      setConfidence(20);
      
      const mlResult = await modelManager.predictFood(selectedImage);
      
      if (!mlResult.success) {
        throw new Error(mlResult.error || 'AI recognition failed');
      }

      // Stage 2: Image Analysis for Portions
      setProcessingStage('Analyzing portion sizes...');
      setConfidence(50);
      
      const imageData = await getImageData(selectedImage);
      const portionEstimate = EnhancedNutritionCalculator.calculatePortionFromImage(imageData);
      
      // Stage 3: Multi-food Detection
      setProcessingStage('Detecting multiple foods...');
      setConfidence(75);
      
      const multipleFoods = EnhancedNutritionCalculator.analyzeMultipleFoods(imageData);
      
      // Stage 4: Combine Results
      setProcessingStage('Calculating nutrition...');
      setConfidence(90);
      
      const enhancedResults: DetectedFood[] = mlResult.predictions.map((prediction, index) => ({
        name: prediction.className,
        confidence: prediction.confidence,
        portion: portionEstimate * (multipleFoods[index]?.portion || 1),
        nutrition: {
          calories: (prediction.nutrients?.calories || 100) * portionEstimate,
          protein: (prediction.nutrients?.protein || 5) * portionEstimate,
          carbs: (prediction.nutrients?.carbs || 20) * portionEstimate,
          fat: (prediction.nutrients?.fat || 3) * portionEstimate,
        },
        boundingBox: generateBoundingBox(index, multipleFoods.length)
      }));

      setDetectedFoods(enhancedResults);
      setConfidence(100);
      setProcessingStage('Analysis complete!');
      
      // Draw bounding boxes if canvas is available
      if (canvasRef.current && previewUrl) {
        drawBoundingBoxes(enhancedResults);
      }

      toast({
        title: "Enhanced Analysis Complete! 🎉",
        description: `Detected ${enhancedResults.length} food items with advanced portion estimation`,
      });

    } catch (error) {
      console.error('Enhanced food recognition error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
      setConfidence(0);
    }
  };

  const getImageData = async (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 224;
        canvas.height = 224;
        ctx?.drawImage(img, 0, 0, 224, 224);
        const imageData = ctx?.getImageData(0, 0, 224, 224);
        resolve(imageData!);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const generateBoundingBox = (index: number, total: number) => {
    // Generate realistic bounding boxes for demonstration
    const spacing = 100 / total;
    return {
      x: (spacing * index) + 10,
      y: 20 + (index * 15),
      width: Math.max(60, 100 - (index * 10)),
      height: Math.max(40, 80 - (index * 8))
    };
  };

  const drawBoundingBoxes = (foods: DetectedFood[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    foods.forEach((food, index) => {
      if (food.boundingBox) {
        const { x, y, width, height } = food.boundingBox;
        
        // Draw bounding box
        ctx.strokeStyle = `hsl(${index * 60}, 70%, 50%)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw label
        ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
        ctx.fillRect(x, y - 20, width, 20);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(food.name, x + 2, y - 6);
      }
    });
  };

  const addFoodToLog = (food: DetectedFood) => {
    // Integration with food logging system
    window.dispatchEvent(new CustomEvent('add-food-from-recognition', {
      detail: {
        food_name: food.name,
        calories: food.nutrition.calories,
        protein: food.nutrition.protein,
        carbohydrates: food.nutrition.carbs,
        fat: food.nutrition.fat,
        portion_size: food.portion
      }
    }));

    toast({
      title: "Food Added to Log",
      description: `${food.name} (${Math.round(food.nutrition.calories)} cal) added successfully`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Enhanced Food Recognition
            <Badge variant="secondary" className="ml-2">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload */}
          <div className="relative">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Food to analyze"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            ) : (
              <div 
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Advanced Food Analysis</p>
                  <p className="text-sm text-muted-foreground">AI-powered portion estimation & multi-food detection</p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                <span className="text-sm font-medium">{processingStage}</span>
              </div>
              <Progress value={confidence} className="w-full" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={analyzeImage}
              disabled={!selectedImage || isProcessing}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              {isProcessing ? 'Analyzing...' : 'Analyze Food'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload className="mr-2 h-4 w-4" />
              New Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {detectedFoods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Foods & Nutrition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedFoods.map((food, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">{food.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Confidence: {Math.round(food.confidence * 100)}%</span>
                      <span>Portion: {food.portion.toFixed(1)}x</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => addFoodToLog(food)}>
                    Add to Log
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{Math.round(food.nutrition.calories)}</div>
                    <div className="text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{Math.round(food.nutrition.protein)}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">{Math.round(food.nutrition.carbs)}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">{Math.round(food.nutrition.fat)}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
