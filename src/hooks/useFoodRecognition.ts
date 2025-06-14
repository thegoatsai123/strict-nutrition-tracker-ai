
import { useState, useCallback } from 'react';
import { modelManager } from '@/services/mlModels/ModelManager';
import { MLModelResponse } from '@/services/mlModels/types';
import { useToast } from '@/hooks/use-toast';

export const useFoodRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<MLModelResponse | null>(null);
  const { toast } = useToast();

  const recognizeFood = useCallback(async (imageFile: File): Promise<MLModelResponse> => {
    setIsProcessing(true);
    
    try {
      const result = await modelManager.predictFood(imageFile);
      setLastResult(result);

      if (result.success && result.predictions.length > 0) {
        toast({
          title: "Food Recognition Successful! 🎉",
          description: `Detected: ${result.predictions[0].className} (${Math.round(result.predictions[0].confidence * 100)}% confidence)`
        });
      } else {
        toast({
          title: "Recognition Failed",
          description: result.error || "Could not identify the food in the image",
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      const errorResult: MLModelResponse = {
        success: false,
        predictions: [],
        provider: 'none',
        processingTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setLastResult(errorResult);
      
      toast({
        title: "Recognition Error",
        description: "An error occurred while processing the image",
        variant: "destructive"
      });

      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const getAvailableProviders = useCallback(() => {
    return modelManager.getAvailableProviders();
  }, []);

  return {
    recognizeFood,
    isProcessing,
    lastResult,
    getAvailableProviders
  };
};
