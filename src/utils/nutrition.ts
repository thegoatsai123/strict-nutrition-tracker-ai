
import { INutritionalData, IFoodItem, INutrient, IUserProfile, ActivityLevel } from '../types';

// Nutrient ID mappings from USDA FoodData Central
export const NUTRIENT_IDS = {
  ENERGY: 208,
  PROTEIN: 203,
  TOTAL_FAT: 204,
  CARBOHYDRATE: 205,
  FIBER: 291,
  SUGARS: 269,
  SODIUM: 307,
  CHOLESTEROL: 601,
  SATURATED_FAT: 606,
  TRANS_FAT: 605,
  VITAMIN_C: 401,
  CALCIUM: 301,
  IRON: 303
} as const;

export class NutritionCalculator {
  static extractNutritionalData(foodItem: IFoodItem, quantity: number = 100): INutritionalData {
    const nutrients = foodItem.foodNutrients;
    
    const getNutrientValue = (nutrientId: number): number => {
      const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
      if (!nutrient) return 0;
      
      // Scale by quantity (assuming base is per 100g)
      return (nutrient.value * quantity) / 100;
    };

    return {
      calories: getNutrientValue(NUTRIENT_IDS.ENERGY),
      protein: getNutrientValue(NUTRIENT_IDS.PROTEIN),
      carbohydrates: getNutrientValue(NUTRIENT_IDS.CARBOHYDRATE),
      fat: getNutrientValue(NUTRIENT_IDS.TOTAL_FAT),
      fiber: getNutrientValue(NUTRIENT_IDS.FIBER),
      sugar: getNutrientValue(NUTRIENT_IDS.SUGARS),
      sodium: getNutrientValue(NUTRIENT_IDS.SODIUM),
      cholesterol: getNutrientValue(NUTRIENT_IDS.CHOLESTEROL),
      saturatedFat: getNutrientValue(NUTRIENT_IDS.SATURATED_FAT),
      transFat: getNutrientValue(NUTRIENT_IDS.TRANS_FAT),
      vitaminC: getNutrientValue(NUTRIENT_IDS.VITAMIN_C),
      calcium: getNutrientValue(NUTRIENT_IDS.CALCIUM),
      iron: getNutrientValue(NUTRIENT_IDS.IRON)
    };
  }

  static calculateBMR(profile: IUserProfile): number {
    const { age, weight, height, gender } = profile;
    
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }

  static calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  }

  static calculateMacroDistribution(totalCalories: number, dietType: string = 'none') {
    const distributions = {
      none: { protein: 0.25, carbs: 0.45, fat: 0.30 },
      keto: { protein: 0.25, carbs: 0.05, fat: 0.70 },
      paleo: { protein: 0.30, carbs: 0.35, fat: 0.35 },
      vegetarian: { protein: 0.20, carbs: 0.50, fat: 0.30 },
      vegan: { protein: 0.15, carbs: 0.55, fat: 0.30 }
    };

    const distribution = distributions[dietType as keyof typeof distributions] || distributions.none;

    return {
      protein: Math.round((totalCalories * distribution.protein) / 4), // 4 cal/g
      carbs: Math.round((totalCalories * distribution.carbs) / 4), // 4 cal/g
      fat: Math.round((totalCalories * distribution.fat) / 9) // 9 cal/g
    };
  }

  static aggregateNutritionalData(nutritionalDataArray: INutritionalData[]): INutritionalData {
    return nutritionalDataArray.reduce((total, current) => ({
      calories: total.calories + current.calories,
      protein: total.protein + current.protein,
      carbohydrates: total.carbohydrates + current.carbohydrates,
      fat: total.fat + current.fat,
      fiber: total.fiber + current.fiber,
      sugar: total.sugar + current.sugar,
      sodium: total.sodium + current.sodium,
      cholesterol: total.cholesterol + current.cholesterol,
      saturatedFat: total.saturatedFat + current.saturatedFat,
      transFat: total.transFat + current.transFat,
      vitaminC: total.vitaminC + current.vitaminC,
      calcium: total.calcium + current.calcium,
      iron: total.iron + current.iron
    }), {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0,
      vitaminC: 0,
      calcium: 0,
      iron: 0
    });
  }

  static calculateNutrientPercentage(consumed: number, target: number): number {
    if (target === 0) return 0;
    return Math.round((consumed / target) * 100);
  }

  static getHealthScore(nutritionalData: INutritionalData, goals: IUserProfile['goals']): number {
    const proteinScore = Math.min(100, this.calculateNutrientPercentage(nutritionalData.protein, goals.protein));
    const carbScore = Math.min(100, this.calculateNutrientPercentage(nutritionalData.carbohydrates, goals.carbs));
    const fatScore = Math.min(100, this.calculateNutrientPercentage(nutritionalData.fat, goals.fat));
    const calorieScore = Math.min(100, this.calculateNutrientPercentage(nutritionalData.calories, goals.dailyCalories));

    // Weighted average with emphasis on balance
    return Math.round((proteinScore * 0.3 + carbScore * 0.25 + fatScore * 0.25 + calorieScore * 0.2));
  }

  static formatNutrientValue(value: number, unit: string): string {
    if (value < 1 && value > 0) {
      return `${value.toFixed(2)}${unit}`;
    }
    return `${Math.round(value)}${unit}`;
  }
}
