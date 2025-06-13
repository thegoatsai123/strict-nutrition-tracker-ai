
import { 
  IUSDASearchRequest, 
  IUSDASearchResponse, 
  IFoodItem, 
  ISpoonacularSearchRequest, 
  ISpoonacularSearchResponse,
  IRecipe,
  IApiResponse
} from '../types';

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

class ApiService {
  private usdaApiKey: string;
  private spoonacularApiKey: string;

  constructor() {
    this.usdaApiKey = import.meta.env.VITE_USDA_API_KEY;
    this.spoonacularApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

    if (!this.usdaApiKey) {
      throw new Error('USDA API key is required. Please set VITE_USDA_API_KEY environment variable.');
    }
    if (!this.spoonacularApiKey) {
      throw new Error('Spoonacular API key is required. Please set VITE_SPOONACULAR_API_KEY environment variable.');
    }
  }

  // USDA FoodData Central API methods
  async searchFoods(request: IUSDASearchRequest): Promise<IApiResponse<IUSDASearchResponse>> {
    try {
      const params = new URLSearchParams({
        api_key: this.usdaApiKey,
        query: request.query,
        pageSize: (request.pageSize || 25).toString(),
        pageNumber: (request.pageNumber || 1).toString(),
        sortBy: request.sortBy || 'dataType.keyword',
        sortOrder: request.sortOrder || 'asc'
      });

      if (request.brandOwner) {
        params.append('brandOwner', request.brandOwner);
      }

      const response = await fetch(`${USDA_BASE_URL}/foods/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          totalHits: data.totalHits,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          foods: data.foods
        }
      };
    } catch (error) {
      console.error('Error searching foods:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getFoodById(fdcId: number): Promise<IApiResponse<IFoodItem>> {
    try {
      const response = await fetch(`${USDA_BASE_URL}/food/${fdcId}?api_key=${this.usdaApiKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching food by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getFoodsByIds(fdcIds: number[]): Promise<IApiResponse<IFoodItem[]>> {
    try {
      const response = await fetch(`${USDA_BASE_URL}/foods?api_key=${this.usdaApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fdcIds,
          format: 'abridged',
          nutrients: [203, 204, 205, 208, 269, 291, 301, 303, 307, 401] // Essential nutrients
        }),
      });

      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching foods by IDs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Spoonacular API methods
  async searchRecipes(request: ISpoonacularSearchRequest): Promise<IApiResponse<ISpoonacularSearchResponse>> {
    try {
      const params = new URLSearchParams({
        apiKey: this.spoonacularApiKey,
        query: request.query,
        number: (request.number || 12).toString(),
        offset: (request.offset || 0).toString(),
        addRecipeInformation: 'true',
        addRecipeNutrition: 'true'
      });

      if (request.diet) params.append('diet', request.diet);
      if (request.excludeIngredients) params.append('excludeIngredients', request.excludeIngredients);
      if (request.intolerances) params.append('intolerances', request.intolerances);
      if (request.type) params.append('type', request.type);

      const response = await fetch(`${SPOONACULAR_BASE_URL}/complexSearch?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          results: data.results,
          offset: data.offset,
          number: data.number,
          totalResults: data.totalResults
        }
      };
    } catch (error) {
      console.error('Error searching recipes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getRecipeById(id: number): Promise<IApiResponse<IRecipe>> {
    try {
      const params = new URLSearchParams({
        apiKey: this.spoonacularApiKey,
        includeNutrition: 'true'
      });

      const response = await fetch(`${SPOONACULAR_BASE_URL}/${id}/information?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getRandomRecipes(
    tags?: string[], 
    number: number = 6
  ): Promise<IApiResponse<{ recipes: IRecipe[] }>> {
    try {
      const params = new URLSearchParams({
        apiKey: this.spoonacularApiKey,
        number: number.toString(),
        include_nutrition: 'true'
      });

      if (tags && tags.length > 0) {
        params.append('tags', tags.join(','));
      }

      const response = await fetch(`${SPOONACULAR_BASE_URL}/random?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          recipes: data.recipes
        }
      };
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Food Recognition ML API
  async recognizeFood(imageFile: File): Promise<IApiResponse<any>> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const mlApiUrl = import.meta.env.VITE_ML_API_URL;
      if (!mlApiUrl) {
        throw new Error('ML API URL is not configured');
      }

      const response = await fetch(`${mlApiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error recognizing food:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const apiService = new ApiService();
