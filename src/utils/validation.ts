
import { z } from 'zod';

// Profile validation schemas
export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age").optional(),
  weight: z.number().min(20, "Invalid weight").max(500, "Invalid weight").optional(),
  height: z.number().min(50, "Invalid height").max(300, "Invalid height").optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  activity_level: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).optional(),
  diet_type: z.enum(['none', 'vegetarian', 'vegan', 'keto', 'paleo']).optional(),
  daily_calories: z.number().min(800, "Too low").max(5000, "Too high").optional(),
  protein_goal: z.number().min(10, "Too low").max(300, "Too high").optional(),
  carbs_goal: z.number().min(10, "Too low").max(500, "Too high").optional(),
  fat_goal: z.number().min(10, "Too low").max(200, "Too high").optional(),
  allergies: z.array(z.string()).optional(),
  disliked_ingredients: z.array(z.string()).optional(),
});

// Food log validation
export const foodLogSchema = z.object({
  fdc_id: z.number().positive("Invalid food ID"),
  food_description: z.string().min(1, "Food description required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  consumed_at: z.date(),
});

// Post validation for community features
export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  category: z.enum(['general', 'recipes', 'progress', 'questions', 'motivation']),
  tags: z.array(z.string()).optional(),
});

// Utility function to validate data
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Sanitize and validate form inputs
export const sanitizeFormData = (formData: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Remove potential XSS vectors
      sanitized[key] = value
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? item.trim() : item
      ).filter(item => item && item.length > 0);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};
