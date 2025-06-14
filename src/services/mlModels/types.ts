
export interface FoodPrediction {
  className: string;
  confidence: number;
  nutrients?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface MLModelConfig {
  name: string;
  type: 'api' | 'local' | 'hybrid';
  endpoint?: string;
  apiKey?: string;
  modelPath?: string;
  threshold?: number;
}

export interface MLModelProvider {
  name: string;
  predict(imageFile: File): Promise<FoodPrediction[]>;
  isAvailable(): Promise<boolean>;
  initialize?(): Promise<void>;
}

export interface MLModelResponse {
  success: boolean;
  predictions: FoodPrediction[];
  provider: string;
  processingTime: number;
  error?: string;
}
