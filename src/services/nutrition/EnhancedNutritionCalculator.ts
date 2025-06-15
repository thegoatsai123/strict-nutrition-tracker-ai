
import { INutritionalData } from '@/types';

interface MealTiming {
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
}

interface NutritionContext {
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  goals: string[];
  restrictions: string[];
}

export class EnhancedNutritionCalculator {
  static calculatePortionFromImage(imageData: ImageData, referenceObjects?: string[]): number {
    // Analyze image to estimate portion size
    // This is a simplified implementation
    const pixels = imageData.data;
    let foodPixels = 0;
    
    // Count pixels that likely represent food (simplified color analysis)
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Simple heuristic for food colors
      if (this.isFoodColor(r, g, b)) {
        foodPixels++;
      }
    }
    
    const totalPixels = pixels.length / 4;
    const foodRatio = foodPixels / totalPixels;
    
    // Estimate portion based on image coverage
    return Math.max(0.5, Math.min(3.0, foodRatio * 2));
  }

  static analyzeMultipleFoods(imageData: ImageData): Array<{food: string, confidence: number, portion: number}> {
    // Simplified multi-food detection
    // In real implementation, this would use advanced computer vision
    
    const detectedFoods = [
      { food: 'main_dish', confidence: 0.8, portion: 1.0 },
      { food: 'side_dish', confidence: 0.6, portion: 0.5 },
      { food: 'vegetable', confidence: 0.7, portion: 0.8 }
    ];
    
    return detectedFoods.filter(food => food.confidence > 0.5);
  }

  static optimizeNutritionTiming(dailyNutrition: INutritionalData, mealTiming: MealTiming): {
    recommendations: string[];
    adjustments: Partial<MealTiming>;
  } {
    const recommendations: string[] = [];
    const adjustments: Partial<MealTiming> = {};
    
    // Analyze protein distribution
    const proteinBreakfast = (dailyNutrition.protein * mealTiming.breakfast) / 100;
    const proteinLunch = (dailyNutrition.protein * mealTiming.lunch) / 100;
    const proteinDinner = (dailyNutrition.protein * mealTiming.dinner) / 100;
    
    if (proteinBreakfast < 20) {
      recommendations.push('Consider adding more protein to breakfast for better muscle synthesis');
      adjustments.breakfast = Math.min(35, mealTiming.breakfast + 10);
    }
    
    if (proteinDinner > 40) {
      recommendations.push('Try distributing dinner protein throughout the day');
      adjustments.dinner = Math.max(25, mealTiming.dinner - 10);
    }
    
    // Analyze carb timing
    const carbsPreWorkout = dailyNutrition.carbohydrates * 0.3;
    if (carbsPreWorkout < 30) {
      recommendations.push('Consider more carbs before workouts for energy');
    }
    
    return { recommendations, adjustments };
  }

  static calculateAdaptiveGoals(
    currentNutrition: INutritionalData[], 
    context: NutritionContext,
    progressData: any[]
  ): INutritionalData {
    // Calculate baseline needs
    const bmr = this.calculateBMR(context.weight, context.height, context.age);
    const tdee = this.calculateTDEE(bmr, context.activityLevel);
    
    // Analyze recent progress
    const recentAverage = this.calculateRecentAverage(currentNutrition);
    const progressTrend = this.analyzeProgressTrend(progressData);
    
    // Adjust goals based on progress and context
    let calorieAdjustment = 0;
    let proteinMultiplier = 1.0;
    
    if (context.goals.includes('weight_loss') && progressTrend.weightChange > 0) {
      calorieAdjustment = -200; // Slight deficit increase
    } else if (context.goals.includes('muscle_gain') && progressTrend.strengthGain < 0.02) {
      proteinMultiplier = 1.2; // Increase protein
      calorieAdjustment = 100; // Slight surplus
    }
    
    return {
      calories: tdee + calorieAdjustment,
      protein: (context.weight * 1.6 * proteinMultiplier),
      carbohydrates: ((tdee + calorieAdjustment) * 0.45) / 4,
      fat: ((tdee + calorieAdjustment) * 0.25) / 9,
      fiber: 25 + (context.age > 50 ? 10 : 0),
      sugar: Math.min(50, (tdee + calorieAdjustment) * 0.1 / 4),
      sodium: 2300 - (context.age > 50 ? 300 : 0),
      cholesterol: 300,
      saturatedFat: ((tdee + calorieAdjustment) * 0.1) / 9,
      transFat: 0,
      vitaminC: 90,
      calcium: 1000 + (context.age > 50 ? 200 : 0),
      iron: context.age < 50 ? 18 : 8
    };
  }

  private static isFoodColor(r: number, g: number, b: number): boolean {
    // Simple heuristic for food colors
    const brightness = (r + g + b) / 3;
    const colorVariance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
    
    return brightness > 50 && brightness < 240 && colorVariance > 20;
  }

  private static calculateBMR(weight: number, height: number, age: number): number {
    // Mifflin-St Jeor Equation (simplified for mixed gender)
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }

  private static calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.375);
  }

  private static calculateRecentAverage(nutrition: INutritionalData[]): INutritionalData {
    if (nutrition.length === 0) {
      return {
        calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0,
        sugar: 0, sodium: 0, cholesterol: 0, saturatedFat: 0, transFat: 0,
        vitaminC: 0, calcium: 0, iron: 0
      };
    }
    
    const recent = nutrition.slice(-7); // Last 7 days
    const totals = recent.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbohydrates: acc.carbohydrates + day.carbohydrates,
      fat: acc.fat + day.fat,
      fiber: acc.fiber + day.fiber,
      sugar: acc.sugar + day.sugar,
      sodium: acc.sodium + day.sodium,
      cholesterol: acc.cholesterol + day.cholesterol,
      saturatedFat: acc.saturatedFat + day.saturatedFat,
      transFat: acc.transFat + day.transFat,
      vitaminC: acc.vitaminC + day.vitaminC,
      calcium: acc.calcium + day.calcium,
      iron: acc.iron + day.iron
    }));
    
    const count = recent.length;
    return {
      calories: totals.calories / count,
      protein: totals.protein / count,
      carbohydrates: totals.carbohydrates / count,
      fat: totals.fat / count,
      fiber: totals.fiber / count,
      sugar: totals.sugar / count,
      sodium: totals.sodium / count,
      cholesterol: totals.cholesterol / count,
      saturatedFat: totals.saturatedFat / count,
      transFat: totals.transFat / count,
      vitaminC: totals.vitaminC / count,
      calcium: totals.calcium / count,
      iron: totals.iron / count
    };
  }

  private static analyzeProgressTrend(progressData: any[]): {
    weightChange: number;
    strengthGain: number;
    energyLevel: number;
  } {
    if (progressData.length < 2) {
      return { weightChange: 0, strengthGain: 0, energyLevel: 0 };
    }
    
    const recent = progressData.slice(-7);
    const older = progressData.slice(-14, -7);
    
    const recentWeight = recent.reduce((sum, d) => sum + (d.weight || 0), 0) / recent.length;
    const olderWeight = older.reduce((sum, d) => sum + (d.weight || 0), 0) / older.length;
    
    return {
      weightChange: recentWeight - olderWeight,
      strengthGain: 0.02, // Placeholder - would calculate from exercise data
      energyLevel: 0.8 // Placeholder - would calculate from user reports
    };
  }
}
