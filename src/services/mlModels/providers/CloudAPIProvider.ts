
import { MLModelProvider, FoodPrediction } from '../types';

export class CloudAPIProvider implements MLModelProvider {
  name = 'cloud-api';
  private apiEndpoint: string;
  private apiKey: string;

  constructor(apiEndpoint: string, apiKey: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Check if API is reachable
      const response = await fetch(`${this.apiEndpoint}/health`, {
        method: 'HEAD',
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async predict(imageFile: File): Promise<FoodPrediction[]> {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${this.apiEndpoint}/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatPredictions(data);
    } catch (error) {
      console.error('Cloud API prediction failed:', error);
      throw error;
    }
  }

  private formatPredictions(apiResponse: any): FoodPrediction[] {
    // Format based on your API response structure
    if (apiResponse.predictions) {
      return apiResponse.predictions.map((pred: any) => ({
        className: pred.label || pred.class_name,
        confidence: pred.confidence || pred.score,
        nutrients: pred.nutrition
      }));
    }
    return [];
  }
}
