
// Simplified types for dummy data - avoiding the complex Spoonacular API structure
export interface IDummyRecipe {
  id: number;
  title: string;
  description: string;
  calories: number;
  protein: number;
  cookTime: string;
  difficulty: string;
  tags: string[];
  image: string;
  readyInMinutes: number;
  servings: number;
  aggregateLikes: number;
  instructions?: string[];
  ingredients?: string[];
}

export interface IDummyCommunityPost {
  id: number;
  author: { name: string; avatar: string };
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export interface IDummyTodayStats {
  calories: number;
  calorieGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbGoal: number;
  fat: number;
  fatGoal: number;
}

export interface IDummyRecentMeal {
  id: number;
  meal: string;
  description: string;
  calories: number;
  time: string;
}

export interface IDummyWeeklyProgress {
  averageCalories: number;
  proteinGoalAchievement: number;
  daysLogged: number;
  totalDays: number;
  weightChange: number;
}

export interface IDummyCommunityStats {
  activeMembers: number;
  postsThisWeek: number;
  successStories: number;
}

export interface IDummyRecipeCategory {
  name: string;
  count: number;
  color: string;
}

export interface IDummyFeaturedMember {
  name: string;
  achievement: string;
  story: string;
  avatar: string;
}
