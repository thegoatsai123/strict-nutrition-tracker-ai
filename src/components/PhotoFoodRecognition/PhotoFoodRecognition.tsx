
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface PhotoFoodRecognitionProps {
  onFoodRecognized: (predictions: Array<{ className: string; confidence: number }>) => void;
  onClose: () => void;
}

export const PhotoFoodRecognition: React.FC<PhotoFoodRecognitionProps> = ({ onFoodRecognized, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<Array<{ className: string; confidence: number }>>([]);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const response = await apiService.recognizeFood(selectedImage);
      if (response.success && response.data) {
        setPredictions(response.data.predictions);
        onFoodRecognized(response.data.predictions);
        toast({
          title: "Food Recognized",
          description: `Found ${response.data.predictions.length} food items`
        });
      } else {
        toast({
          title: "Recognition Failed",
          description: response.error || "Could not recognize food in image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Food recognition error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
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
    <Card className="w-full max-w-md mx-auto">
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="flex-1">
                {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
              </Button>
              <Button variant="outline" onClick={resetImage}>
                Reset
              </Button>
            </div>

            {predictions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Detected Foods:</h4>
                {predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{prediction.className}</span>
                    <Badge variant="secondary">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </Badge>
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
