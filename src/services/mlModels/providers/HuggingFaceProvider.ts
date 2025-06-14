
import { MLModelProvider, FoodPrediction } from '../types';

export class HuggingFaceProvider implements MLModelProvider {
  name = 'huggingface';
  private pipeline: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      // Load Hugging Face transformers
      const { pipeline } = await import('@huggingface/transformers');
      
      this.pipeline = await pipeline(
        'image-classification',
        'nateraw/food',
        { device: 'webgpu' } // Use WebGPU if available, fallback to CPU
      );
      
      this.isInitialized = true;
      console.log('Hugging Face model loaded successfully');
    } catch (error) {
      console.error('Failed to load Hugging Face model:', error);
      // Fallback to CPU if WebGPU fails
      try {
        const { pipeline } = await import('@huggingface/transformers');
        this.pipeline = await pipeline('image-classification', 'nateraw/food');
        this.isInitialized = true;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.isInitialized && this.pipeline !== null;
  }

  async predict(imageFile: File): Promise<FoodPrediction[]> {
    if (!this.isInitialized || !this.pipeline) {
      throw new Error('Hugging Face model not initialized');
    }

    try {
      const imageUrl = URL.createObjectURL(imageFile);
      const predictions = await this.pipeline(imageUrl);
      
      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);

      return predictions.map((pred: any) => ({
        className: pred.label,
        confidence: pred.score
      }));
    } catch (error) {
      console.error('Hugging Face prediction failed:', error);
      throw error;
    }
  }
}
