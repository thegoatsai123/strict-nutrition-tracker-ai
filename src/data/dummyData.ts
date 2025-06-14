
export const dummyRecipes = [
  {
    id: 1,
    title: "Mediterranean Quinoa Bowl with Grilled Chicken",
    description: "A nutrient-packed bowl with quinoa, grilled chicken, fresh vegetables, and tahini dressing",
    calories: 485,
    protein: 38,
    cookTime: "25 min",
    difficulty: "Easy",
    tags: ["High Protein", "Gluten Free", "Mediterranean"],
    image: "/api/placeholder/400/300",
    readyInMinutes: 25,
    servings: 2,
    aggregateLikes: 127
  },
  {
    id: 2,
    title: "Salmon Teriyaki with Brown Rice",
    description: "Pan-seared salmon glazed with homemade teriyaki sauce, served with steamed vegetables",
    calories: 520,
    protein: 42,
    cookTime: "20 min",
    difficulty: "Medium",
    tags: ["Heart Healthy", "Omega-3", "Asian"],
    image: "/api/placeholder/400/300",
    readyInMinutes: 20,
    servings: 2,
    aggregateLikes: 89
  },
  {
    id: 3,
    title: "Vegetarian Buddha Bowl",
    description: "Colorful bowl with roasted chickpeas, sweet potato, avocado, and tahini dressing",
    calories: 420,
    protein: 18,
    cookTime: "30 min",
    difficulty: "Easy",
    tags: ["Vegetarian", "Vegan", "High Fiber"],
    image: "/api/placeholder/400/300",
    readyInMinutes: 30,
    servings: 2,
    aggregateLikes: 156
  },
  {
    id: 4,
    title: "Turkey and Avocado Lettuce Wraps",
    description: "Light and refreshing wraps with lean turkey, fresh avocado, and crisp vegetables",
    calories: 285,
    protein: 28,
    cookTime: "10 min",
    difficulty: "Easy",
    tags: ["Low Carb", "Keto", "Quick"],
    image: "/api/placeholder/400/300",
    readyInMinutes: 10,
    servings: 4,
    aggregateLikes: 203
  },
  {
    id: 5,
    title: "Lentil and Vegetable Curry",
    description: "Hearty curry packed with red lentils, mixed vegetables, and aromatic spices",
    calories: 350,
    protein: 20,
    cookTime: "35 min",
    difficulty: "Medium",
    tags: ["Vegetarian", "High Protein", "Indian"],
    image: "/api/placeholder/400/300",
    readyInMinutes: 35,
    servings: 4,
    aggregateLikes: 174
  }
];

export const dummyCommunityPosts = [
  {
    id: 1,
    author: { name: "Sarah Johnson", avatar: "/api/placeholder/32/32" },
    title: "Lost 20 pounds using this app! My journey so far",
    content: "Just wanted to share my success story. The food tracking features helped me stay consistent, and the community support has been amazing. Started at 165lbs and now I'm at 145lbs!",
    category: "progress",
    likes: 127,
    comments: 23,
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    author: { name: "Mike Chen", avatar: "/api/placeholder/32/32" },
    title: "Best high-protein breakfast ideas for busy mornings?",
    content: "Looking for some new breakfast recipes that are high in protein but quick to make. I usually have about 10 minutes in the morning. What are your go-to favorites?",
    category: "recipes",
    likes: 45,
    comments: 31,
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    author: { name: "Emma Davis", avatar: "/api/placeholder/32/32" },
    title: "How do you track restaurant meals accurately?",
    content: "I'm struggling with tracking calories when eating out. The portions seem so different from what's listed online. Any tips for better estimation?",
    category: "questions",
    likes: 38,
    comments: 19,
    timeAgo: "6 hours ago"
  },
  {
    id: 4,
    author: { name: "Alex Rodriguez", avatar: "/api/placeholder/32/32" },
    title: "45 pounds down and feeling incredible!",
    content: "This community kept me motivated throughout my entire journey. From 210lbs to 165lbs in 8 months. The key was consistency and not being too hard on myself when I had off days.",
    category: "progress",
    likes: 89,
    comments: 42,
    timeAgo: "8 hours ago"
  },
  {
    id: 5,
    author: { name: "Lisa Thompson", avatar: "/api/placeholder/32/32" },
    title: "Meal prep Sunday inspiration needed!",
    content: "What are your favorite meal prep recipes that actually taste good after a few days? I'm getting tired of the same chicken and rice combo.",
    category: "recipes",
    likes: 56,
    comments: 28,
    timeAgo: "12 hours ago"
  }
];

export const dummyTodayStats = {
  calories: 1850,
  calorieGoal: 2200,
  protein: 95,
  proteinGoal: 120,
  carbs: 220,
  carbGoal: 275,
  fat: 65,
  fatGoal: 73
};

export const dummyRecentMeals = [
  {
    id: 1,
    meal: "Breakfast",
    description: "Greek yogurt with berries and granola",
    calories: 320,
    time: "8:30 AM"
  },
  {
    id: 2,
    meal: "Lunch",
    description: "Grilled chicken caesar salad",
    calories: 450,
    time: "12:45 PM"
  },
  {
    id: 3,
    meal: "Snack",
    description: "Apple with almond butter",
    calories: 190,
    time: "3:15 PM"
  },
  {
    id: 4,
    meal: "Dinner",
    description: "Salmon with roasted vegetables",
    calories: 580,
    time: "7:00 PM"
  }
];

export const dummyWeeklyProgress = {
  averageCalories: 1920,
  proteinGoalAchievement: 85,
  daysLogged: 6,
  totalDays: 7,
  weightChange: -0.5
};

export const dummyCommunityStats = {
  activeMembers: 12458,
  postsThisWeek: 342,
  successStories: 1289
};

export const dummyRecipeCategories = [
  { name: "High Protein", count: 45, color: "bg-blue-100 text-blue-800" },
  { name: "Low Carb", count: 32, color: "bg-green-100 text-green-800" },
  { name: "Vegetarian", count: 28, color: "bg-purple-100 text-purple-800" },
  { name: "Quick Meals", count: 38, color: "bg-orange-100 text-orange-800" },
  { name: "Heart Healthy", count: 25, color: "bg-red-100 text-red-800" },
  { name: "Keto", count: 19, color: "bg-yellow-100 text-yellow-800" }
];

export const dummyFeaturedMember = {
  name: "Alex Rodriguez",
  achievement: "Lost 45 lbs",
  story: "This community kept me motivated throughout my entire journey. The support and advice I received here was invaluable in reaching my goals.",
  avatar: "/api/placeholder/32/32"
};
