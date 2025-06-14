
import { useState, useEffect } from 'react';
import Navbar from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { IRecipe } from '@/types';
import { Clock, Users, Heart, Search, Filter } from 'lucide-react';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dietFilter, setDietFilter] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getRandomRecipes(['healthy'], 12);
      if (response.success && response.data) {
        setRecipes(response.data.recipes);
      } else {
        toast({
          title: "Error",
          description: "Failed to load recipes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading random recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRandomRecipes();
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.searchRecipes({
        query: searchQuery,
        number: 12,
        diet: dietFilter || undefined,
        type: mealType || undefined
      });

      if (response.success && response.data) {
        setRecipes(response.data.results);
        toast({
          title: "Search Complete",
          description: `Found ${response.data.results.length} recipes`
        });
      } else {
        toast({
          title: "Search Failed",
          description: response.error || "Unable to search recipes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Recipe search error:', error);
      toast({
        title: "Search Error",
        description: "An error occurred while searching",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Healthy Recipes</h1>
          <p className="text-gray-600 mt-2">Discover nutritious recipes from our extensive database</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search recipes... (e.g., 'chicken salad', 'pasta')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={dietFilter} onValueChange={setDietFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All diets</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten Free</SelectItem>
                <SelectItem value="ketogenic">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All meals</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setDietFilter('');
                setMealType('');
                setSearchQuery('');
                loadRandomRecipes();
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {recipe.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {recipe.readyInMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.readyInMinutes}m
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </div>
                    )}
                    {recipe.healthScore && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {recipe.healthScore}% healthy
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recipe.diets && recipe.diets.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {recipe.diets.slice(0, 3).map((diet, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {diet}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button className="w-full" variant="outline">
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {recipes.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-xl text-gray-600 mb-2">No recipes found</p>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={loadRandomRecipes}>
              Load Random Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
