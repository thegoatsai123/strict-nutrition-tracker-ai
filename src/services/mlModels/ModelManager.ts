
import { MLModelProvider, MLModelResponse, FoodPrediction } from './types';
import { CustomModelProvider } from './providers/CustomModelProvider';
import { CloudAPIProvider } from './providers/CloudAPIProvider';
import { HuggingFaceProvider } from './providers/HuggingFaceProvider';
import { TensorFlowProvider } from './providers/TensorFlowProvider';
import { WebMLProvider } from './providers/WebMLProvider';

export class ModelManager {
  private providers: MLModelProvider[] = [];
  private primaryProvider: MLModelProvider | null = null;
  private fallbackProviders: MLModelProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    // Add TensorFlow Web provider as primary for local inference
    const tensorflowProvider = new TensorFlowProvider();
    this.providers.push(tensorflowProvider);

    // Add WebML provider for browser native ML
    const webmlProvider = new WebMLProvider();
    this.providers.push(webmlProvider);

    // Add existing providers as fallbacks
    const customModel = new CustomModelProvider();
    this.providers.push(customModel);

    const huggingFaceModel = new HuggingFaceProvider();
    this.providers.push(huggingFaceModel);

    // Add cloud API if configured
    const cloudApiKey = process.env.FOOD_RECOGNITION_API_KEY;
    const cloudEndpoint = process.env.FOOD_RECOGNITION_ENDPOINT;
    
    if (cloudApiKey && cloudEndpoint) {
      const cloudAPI = new CloudAPIProvider(cloudEndpoint, cloudApiKey);
      this.providers.push(cloudAPI);
    }

    // Initialize all providers with retry logic
    await Promise.allSettled(
      this.providers.map(async (provider) => {
        try {
          if (provider.initialize) {
            await provider.initialize();
          }
        } catch (error) {
          console.warn(`Failed to initialize ${provider.name}:`, error);
        }
      })
    );

    // Set primary and fallback providers based on availability
    await this.selectBestProviders();
  }

  private async selectBestProviders() {
    const availableProviders: MLModelProvider[] = [];
    
    for (const provider of this.providers) {
      try {
        const isAvailable = await provider.isAvailable();
        if (isAvailable) {
          availableProviders.push(provider);
        }
      } catch (error) {
        console.warn(`Provider ${provider.name} not available:`, error);
      }
    }

    if (availableProviders.length > 0) {
      // Prioritize local models first for better performance and privacy
      this.primaryProvider = 
        availableProviders.find(p => p.name === 'tensorflow-web') ||
        availableProviders.find(p => p.name === 'webml-api') ||
        availableProviders.find(p => p.name === 'custom-model') ||
        availableProviders[0];
      
      this.fallbackProviders = availableProviders.filter(p => p !== this.primaryProvider);
    }

    console.log('Enhanced ML Model Manager initialized:', {
      primary: this.primaryProvider?.name,
      fallbacks: this.fallbackProviders.map(p => p.name),
      total: availableProviders.length
    });
  }

  async predictFood(imageFile: File): Promise<MLModelResponse> {
    const startTime = Date.now();
    
    // Validate image file
    if (!this.validateImageFile(imageFile)) {
      return {
        success: false,
        predictions: [],
        provider: 'none',
        processingTime: 0,
        error: 'Invalid image file format or size'
      };
    }
    
    // Try primary provider first
    if (this.primaryProvider) {
      try {
        const predictions = await this.primaryProvider.predict(imageFile);
        return {
          success: true,
          predictions: this.enhancePredictions(predictions),
          provider: this.primaryProvider.name,
          processingTime: Date.now() - startTime
        };
      } catch (error) {
        console.warn(`Primary provider ${this.primaryProvider.name} failed:`, error);
      }
    }

    // Try fallback providers with exponential backoff
    for (const [index, provider] of this.fallbackProviders.entries()) {
      try {
        // Add delay for fallback providers to avoid overwhelming
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, index) * 100));
        }
        
        const predictions = await provider.predict(imageFile);
        return {
          success: true,
          predictions: this.enhancePredictions(predictions),
          provider: provider.name,
          processingTime: Date.now() - startTime
        };
      } catch (error) {
        console.warn(`Fallback provider ${provider.name} failed:`, error);
      }
    }

    // All providers failed
    return {
      success: false,
      predictions: [],
      provider: 'none',
      processingTime: Date.now() - startTime,
      error: 'All ML providers failed - check network connection and image quality'
    };
  }

  private validateImageFile(file: File): boolean {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return false;
    }
    
    // Check for supported formats
    const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    return supportedFormats.includes(file.type);
  }

  private enhancePredictions(predictions: FoodPrediction[]): FoodPrediction[] {
    return predictions
      .filter(p => p.confidence > 0.1) // Filter out very low confidence predictions
      .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
      .slice(0, 5) // Limit to top 5 predictions
      .map(prediction => ({
        ...prediction,
        className: this.normalizeClassName(prediction.className),
        nutrients: prediction.nutrients || this.estimateBasicNutrients(prediction.className)
      }));
  }

  private normalizeClassName(className: string): string {
    return className
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private estimateBasicNutrients(foodName: string) {
    // Basic nutrient estimation based on food type
    const foodCategories = {
      fruit: { calories: 60, protein: 1, carbs: 15, fat: 0.2 },
      vegetable: { calories: 25, protein: 2, carbs: 5, fat: 0.1 },
      meat: { calories: 200, protein: 25, carbs: 0, fat: 10 },
      grain: { calories: 150, protein: 5, carbs: 30, fat: 1 },
      dairy: { calories: 100, protein: 8, carbs: 5, fat: 5 }
    };

    // Simple keyword matching
    const name = foodName.toLowerCase();
    if (name.includes('apple') || name.includes('banana') || name.includes('fruit')) {
      return foodCategories.fruit;
    } else if (name.includes('salad') || name.includes('vegetable') || name.includes('broccoli')) {
      return foodCategories.vegetable;
    } else if (name.includes('chicken') || name.includes('meat') || name.includes('beef')) {
      return foodCategories.meat;
    } else if (name.includes('rice') || name.includes('bread') || name.includes('pasta')) {
      return foodCategories.grain;
    } else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) {
      return foodCategories.dairy;
    }
    
    // Default generic food
    return { calories: 100, protein: 5, carbs: 15, fat: 3 };
  }

  async addCustomProvider(provider: MLModelProvider) {
    this.providers.push(provider);
    
    try {
      if (provider.initialize) {
        await provider.initialize();
      }
      
      const isAvailable = await provider.isAvailable();
      if (isAvailable) {
        this.fallbackProviders.push(provider);
      }
    } catch (error) {
      console.error(`Failed to add custom provider ${provider.name}:`, error);
    }
  }

  getAvailableProviders(): string[] {
    return [
      this.primaryProvider?.name,
      ...this.fallbackProviders.map(p => p.name)
    ].filter(Boolean) as string[];
  }

  getProviderStats() {
    return {
      primary: this.primaryProvider?.name || 'none',
      fallbacks: this.fallbackProviders.length,
      total: this.providers.length,
      available: this.getAvailableProviders().length
    };
  }

  async reinitialize() {
    this.providers = [];
    this.primaryProvider = null;
    this.fallbackProviders = [];
    await this.initializeProviders();
  }
}

export const modelManager = new ModelManager();
