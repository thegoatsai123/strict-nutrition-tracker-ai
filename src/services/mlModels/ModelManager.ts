
import { MLModelProvider, MLModelResponse, FoodPrediction } from './types';
import { CustomModelProvider } from './providers/CustomModelProvider';
import { CloudAPIProvider } from './providers/CloudAPIProvider';
import { HuggingFaceProvider } from './providers/HuggingFaceProvider';

export class ModelManager {
  private providers: MLModelProvider[] = [];
  private primaryProvider: MLModelProvider | null = null;
  private fallbackProviders: MLModelProvider[] = [];

  constructor() {
    this.initializeProviders();
  }

  private async initializeProviders() {
    // Add your custom model as primary
    const customModel = new CustomModelProvider();
    this.providers.push(customModel);

    // Add Hugging Face as fallback
    const huggingFaceModel = new HuggingFaceProvider();
    this.providers.push(huggingFaceModel);

    // Add cloud API if configured
    const cloudApiKey = process.env.FOOD_RECOGNITION_API_KEY;
    const cloudEndpoint = process.env.FOOD_RECOGNITION_ENDPOINT;
    
    if (cloudApiKey && cloudEndpoint) {
      const cloudAPI = new CloudAPIProvider(cloudEndpoint, cloudApiKey);
      this.providers.push(cloudAPI);
    }

    // Initialize all providers
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
      // Prioritize custom model, then others
      this.primaryProvider = availableProviders.find(p => p.name === 'custom-model') || availableProviders[0];
      this.fallbackProviders = availableProviders.filter(p => p !== this.primaryProvider);
    }

    console.log('ML Model Manager initialized:', {
      primary: this.primaryProvider?.name,
      fallbacks: this.fallbackProviders.map(p => p.name)
    });
  }

  async predictFood(imageFile: File): Promise<MLModelResponse> {
    const startTime = Date.now();
    
    // Try primary provider first
    if (this.primaryProvider) {
      try {
        const predictions = await this.primaryProvider.predict(imageFile);
        return {
          success: true,
          predictions,
          provider: this.primaryProvider.name,
          processingTime: Date.now() - startTime
        };
      } catch (error) {
        console.warn(`Primary provider ${this.primaryProvider.name} failed:`, error);
      }
    }

    // Try fallback providers
    for (const provider of this.fallbackProviders) {
      try {
        const predictions = await provider.predict(imageFile);
        return {
          success: true,
          predictions,
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
      error: 'All ML providers failed'
    };
  }

  async addCustomProvider(provider: MLModelProvider) {
    this.providers.push(provider);
    
    try {
      if (provider.initialize) {
        await provider.initialize();
      }
      
      const isAvailable = await provider.isAvailable();
      if (isAvailable) {
        // Add to fallback providers
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
}

export const modelManager = new ModelManager();
