
import { useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredRecipes = [
    {
      id: 1,
      title: "Grilled Chicken with Quinoa",
      description: "High-protein meal perfect for muscle building",
      calories: 420,
      protein: 35,
      cookTime: "25 min",
      difficulty: "Easy",
      tags: ["High Protein", "Gluten Free"]
    },
    {
      id: 2,
      title: "Mediterranean Bowl",
      description: "Fresh vegetables with olive oil and feta",
      calories: 380,
      protein: 18,
      cookTime: "15 min",
      difficulty: "Easy",
      tags: ["Vegetarian", "Mediterranean"]
    },
    {
      id: 3,
      title: "Salmon with Sweet Potato",
      description: "Omega-3 rich fish with complex carbs",
      calories: 450,
      protein: 32,
      cookTime: "30 min",
      difficulty: "Medium",
      tags: ["Heart Healthy", "Omega-3"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Healthy Recipes</h1>
          <p className="text-gray-600 mt-2">Discover nutritious recipes tailored to your goals</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>Search Recipes</Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{recipe.calories} calories</span>
                      <span className="font-medium">{recipe.protein}g protein</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Cook time: {recipe.cookTime}</span>
                      <span>Difficulty: {recipe.difficulty}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Categories</CardTitle>
              <CardDescription>Browse recipes by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="font-medium">High Protein</span>
                  <span className="text-xs text-gray-600">45+ recipes</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="font-medium">Low Carb</span>
                  <span className="text-xs text-gray-600">32+ recipes</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="font-medium">Vegetarian</span>
                  <span className="text-xs text-gray-600">28+ recipes</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col">
                  <span className="font-medium">Quick Meals</span>
                  <span className="text-xs text-gray-600">38+ recipes</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meal Planning</CardTitle>
              <CardDescription>Plan your weekly meals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">No Meal Plan Yet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a weekly meal plan based on your nutrition goals
                  </p>
                  <Button>Create Meal Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
