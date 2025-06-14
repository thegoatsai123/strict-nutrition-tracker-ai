
import { 
  IUSDASearchRequest, 
  IUSDASearchResponse, 
  IFoodItem, 
  ISpoonacularSearchRequest, 
  ISpoonacularSearchResponse,
  IRecipe,
  IApiResponse
} from '../types';
import { supabase } from '@/integrations/supabase/client';

export class ApiService {
  private async callNutritionAPI(action: string, params: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke('nutrition-api', {
      body: { action, ...params }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'API request failed');
    }

    return data;
  }

  // USDA FoodData Central API methods
  async searchFoods(request: IUSDASearchRequest): Promise<IApiResponse<IUSDASearchResponse>> {
    try {
      const response = await this.callNutritionAPI('searchFoods', {
        query: request.query,
        pageSize: request.pageSize || 25,
        pageNumber: request.pageNumber || 1,
        sortBy: request.sortBy || 'dataType.keyword',
        sortOrder: request.sortOrder || 'asc',
        brandOwner: request.brandOwner
      });

      return response;
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
      const response = await this.callNutritionAPI('getFoodById', { fdcId });
      return response;
    } catch (error) {
      console.error('Error fetching food by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Spoonacular API methods
  async searchRecipes(request: ISpoonacularSearchRequest): Promise<IApiResponse<ISpoonacularSearchResponse>> {
    try {
      const response = await this.callNutritionAPI('searchRecipes', {
        query: request.query,
        number: request.number || 12,
        offset: request.offset || 0,
        diet: request.diet,
        excludeIngredients: request.excludeIngredients,
        intolerances: request.intolerances,
        type: request.type
      });

      return response;
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
      const response = await this.callNutritionAPI('getRecipeById', { id });
      return response;
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
      const response = await this.callNutritionAPI('getRandomRecipes', { tags, number });
      return response;
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async recognizeFood(file: File): Promise<IApiResponse<{ predictions: Array<{ className: string; confidence: number }> }>> {
    try {
      const response = await this.callNutritionAPI('recognizeFood', {});
      return response;
    } catch (error) {
      console.error('Food recognition error:', error);
      return {
        success: false,
        error: 'Failed to recognize food in image'
      };
    }
  }
}

export const apiService = new ApiService();
