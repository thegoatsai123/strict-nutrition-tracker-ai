
// Core TypeScript interfaces for the Smart Nutrition Tracker

export interface IUserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  goals: {
    dailyCalories: number;
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
  };
  preferences: {
    dietType: 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
    allergies: string[];
    dislikedIngredients: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IFoodItem {
  fdcId: number; // USDA FoodData Central ID
  description: string;
  brandOwner?: string;
  gtinUpc?: string;
  ingredients?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: INutrient[];
  foodCategory?: string;
  publicationDate?: string;
}

export interface INutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  rank?: number;
}

export interface INutritionalData {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  cholesterol: number; // mg
  saturatedFat: number; // grams
  transFat: number; // grams
  vitaminC: number; // mg
  calcium: number; // mg
  iron: number; // mg
}

export interface IFoodLog {
  id: string;
  userId: string;
  foodItem: IFoodItem;
  quantity: number;
  unit: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: Date;
  nutritionalData: INutritionalData;
  createdAt: Date;
}

export interface IProgressData {
  id: string;
  userId: string;
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
  weight?: number;
  notes?: string;
}

export interface IRecipe {
  id: number; // Spoonacular API ID
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  analyzedInstructions: IInstruction[];
  cheap: boolean;
  creditsText: string;
  cuisines: string[];
  dairyFree: boolean;
  diets: string[];
  gaps: string;
  glutenFree: boolean;
  instructions: string;
  ketogenic: boolean;
  lowFodmap: boolean;
  occasions: string[];
  sustainable: boolean;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  whole30: boolean;
  weightWatcherSmartPoints: number;
  dishTypes: string[];
  extendedIngredients: IExtendedIngredient[];
  summary: string;
  winePairing: IWinePairing;
  nutrition: IRecipeNutrition;
}

export interface IInstruction {
  name: string;
  steps: IStep[];
}

export interface IStep {
  number: number;
  step: string;
  ingredients: IIngredientInfo[];
  equipment: IEquipment[];
  length?: ILength;
}

export interface IIngredientInfo {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface IEquipment {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface ILength {
  number: number;
  unit: string;
}

export interface IExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalString: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  metaInformation: string[];
  measures: IMeasures;
}

export interface IMeasures {
  us: IUnitSystem;
  metric: IUnitSystem;
}

export interface IUnitSystem {
  amount: number;
  unitShort: string;
  unitLong: string;
}

export interface IWinePairing {
  pairedWines: string[];
  pairingText: string;
  productMatches: IWineProduct[];
}

export interface IWineProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  averageRating: number;
  ratingCount: number;
  score: number;
  link: string;
}

export interface IRecipeNutrition {
  nutrients: INutrientInfo[];
  properties: IProperty[];
  flavonoids: IFlavonoid[];
  ingredients: IIngredientNutrition[];
  caloricBreakdown: ICaloricBreakdown;
  weightPerServing: IWeightPerServing;
}

export interface INutrientInfo {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface IProperty {
  name: string;
  amount: number;
  unit: string;
}

export interface IFlavonoid {
  name: string;
  amount: number;
  unit: string;
}

export interface IIngredientNutrition {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: INutrientInfo[];
}

export interface ICaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

export interface IWeightPerServing {
  amount: number;
  unit: string;
}

export interface IPost {
  id: string;
  userId: string;
  author: {
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  category: 'general' | 'recipes' | 'progress' | 'questions' | 'motivation';
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  id: string;
  userId: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrediction {
  predictions: IPredictionResult[];
  processingTime: number;
  confidence: number;
  imageId: string;
}

export interface IPredictionResult {
  className: string;
  probability: number;
  fdcId?: number; // Mapped to USDA database
}

export interface IWearableData {
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRate?: number;
  sleep?: {
    duration: number; // minutes
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  date: Date;
  source: 'fitbit' | 'apple_health' | 'google_fit';
}

export interface IAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'email';
  accessToken?: string;
  refreshToken?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Request/Response types
export interface IUSDASearchRequest {
  query: string;
  pageSize?: number;
  pageNumber?: number;
  sortBy?: 'dataType.keyword' | 'lowercaseDescription.keyword' | 'fdcId' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
  brandOwner?: string;
}

export interface IUSDASearchResponse {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: IFoodItem[];
}

export interface ISpoonacularSearchRequest {
  query: string;
  diet?: string;
  excludeIngredients?: string;
  intolerances?: string;
  number?: number;
  offset?: number;
  type?: string;
}

export interface ISpoonacularSearchResponse {
  results: IRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

// Utility types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type DietType = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
export type Gender = 'male' | 'female' | 'other';

// Environment variables type
export interface IEnvironmentConfig {
  VITE_USDA_API_KEY: string;
  VITE_SPOONACULAR_API_KEY: string;
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_FACEBOOK_APP_ID: string;
  VITE_ML_API_URL: string;
  VITE_BACKEND_URL: string;
}
