
import { MLModelProvider, FoodPrediction } from '../types';

export class TensorFlowProvider implements MLModelProvider {
  name = 'tensorflow-web';
  private model: any = null;
  private isModelLoaded = false;

  async initialize(): Promise<void> {
    try {
      // Dynamic import to avoid bundle size issues
      const tf = await import('@tensorflow/tfjs');
      
      // Load a pre-trained food classification model
      // This would be replaced with your actual model URL
      const modelUrl = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
      
      console.log('Loading TensorFlow model...');
      this.model = await tf.loadLayersModel(modelUrl);
      this.isModelLoaded = true;
      console.log('TensorFlow model loaded successfully');
    } catch (error) {
      console.error('Failed to load TensorFlow model:', error);
      this.isModelLoaded = false;
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.isModelLoaded && this.model !== null;
  }

  async predict(imageFile: File): Promise<FoodPrediction[]> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('TensorFlow model not loaded');
    }

    try {
      const tf = await import('@tensorflow/tfjs');
      
      // Convert file to tensor
      const imageElement = await this.fileToImageElement(imageFile);
      const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .expandDims(0)
        .cast('float32')
        .div(255.0);

      // Run prediction
      const predictions = await this.model.predict(tensor);
      const probabilities = await predictions.data() as Float32Array;

      // Convert to food predictions (simplified mapping)
      const foodPredictions: FoodPrediction[] = [
        {
          className: this.mapToFoodClass(probabilities),
          confidence: Math.max(...Array.from(probabilities)),
          nutrients: this.estimateNutrients(probabilities)
        }
      ];

      // Clean up tensors
      tensor.dispose();
      predictions.dispose();

      return foodPredictions;
    } catch (error) {
      console.error('TensorFlow prediction error:', error);
      throw error;
    }
  }

  private async fileToImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private mapToFoodClass(probabilities: Float32Array): string {
    // Simplified mapping - in real implementation, use proper food classification labels
    const foodClasses = [
      'apple', 'banana', 'pizza', 'burger', 'salad', 'sandwich', 
      'pasta', 'rice', 'chicken', 'fish', 'bread', 'soup'
    ];
    
    // Find the index of maximum probability correctly
    let maxIndex = 0;
    let maxValue = probabilities[0];
    
    for (let i = 1; i < probabilities.length; i++) {
      if (probabilities[i] > maxValue) {
        maxValue = probabilities[i];
        maxIndex = i;
      }
    }
    
    return foodClasses[maxIndex % foodClasses.length] || 'unknown food';
  }

  private estimateNutrients(probabilities: Float32Array): any {
    // Basic nutrient estimation based on food type
    const maxProb = Math.max(...Array.from(probabilities));
    return {
      calories: Math.round(maxProb * 300),
      protein: Math.round(maxProb * 20),
      carbs: Math.round(maxProb * 40),
      fat: Math.round(maxProb * 15)
    };
  }
}
