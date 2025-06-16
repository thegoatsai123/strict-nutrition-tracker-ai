
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { IRecipe } from '@/types';
import { Clock, Users, Heart, Search, Filter, BookOpen, Star, ChefHat, Plus } from 'lucide-react';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<IRecipe[]>([]);
  const [myRecipes, setMyRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dietFilter, setDietFilter] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('browse');
  const { toast } = useToast();

  // Mock data for saved and personal recipes
  useEffect(() => {
    setSavedRecipes([
      {
        id: 1,
        title: "Mediterranean Quinoa Bowl",
        image: "/placeholder.svg",
        readyInMinutes: 25,
        servings: 2,
        healthScore: 95,
        diets: ["vegetarian", "gluten-free"]
      },
      {
        id: 2,
        title: "Grilled Salmon with Vegetables",
        image: "/placeholder.svg",
        readyInMinutes: 30,
        servings: 4,
        healthScore: 92,
        diets: ["ketogenic", "low-carb"]
      }
    ] as IRecipe[]);

    setMyRecipes([
      {
        id: 1,
        title: "My Special Protein Smoothie",
        description: "A delicious post-workout smoothie with banana and protein powder",
        prepTime: 5,
        servings: 1,
        ingredients: ["1 banana", "1 scoop protein powder", "1 cup almond milk", "1 tbsp peanut butter"],
        instructions: ["Blend all ingredients until smooth", "Serve immediately"],
        category: "breakfast"
      }
    ]);
  }, []);

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

  const saveRecipe = (recipe: IRecipe) => {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes([...savedRecipes, recipe]);
      toast({
        title: "Recipe Saved",
        description: `${recipe.title} has been added to your saved recipes`
      });
    }
  };

  const RecipeCard = ({ recipe, onSave, showSaveButton = true }: { recipe: IRecipe, onSave?: (recipe: IRecipe) => void, showSaveButton?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
      {recipe.image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showSaveButton && onSave && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onSave(recipe)}
            >
              <Heart className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                <Badge key={index} variant="secondary" className="text-xs capitalize">
                  {diet}
                </Badge>
              ))}
            </div>
          )}
          <Button className="w-full" variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            View Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const MyRecipeCard = ({ recipe }: { recipe: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{recipe.title}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.prepTime}m
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings} servings
          </div>
          <Badge variant="outline" className="capitalize">
            {recipe.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Ingredients:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {recipe.ingredients.slice(0, 3).map((ingredient: string, index: number) => (
                <li key={index}>• {ingredient}</li>
              ))}
              {recipe.ingredients.length > 3 && <li>... and {recipe.ingredients.length - 3} more</li>}
            </ul>
          </div>
          <Button className="w-full" variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            View Full Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Recipe Hub
          </h1>
          <p className="text-muted-foreground mt-1">Discover, save, and create delicious healthy recipes</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          10k+ Recipes Available
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Recipes</TabsTrigger>
          <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recipes... (e.g., 'chicken salad', 'pasta')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className="shrink-0">
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
                  className="shrink-0"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onSave={saveRecipe}
                />
              ))}
            </div>
          )}

          {recipes.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground mb-2">No recipes found</p>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={loadRandomRecipes}>
                Load Random Recipes
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Saved Recipes ({savedRecipes.length})</h2>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Saved
            </Button>
          </div>
          
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  showSaveButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground mb-2">No saved recipes yet</p>
              <p className="text-muted-foreground mb-6">
                Start browsing and save recipes you love!
              </p>
              <Button onClick={() => setActiveTab('browse')}>
                Browse Recipes
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-recipes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Recipes ({myRecipes.length})</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Recipe
            </Button>
          </div>
          
          {myRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <MyRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground mb-2">No personal recipes yet</p>
              <p className="text-muted-foreground mb-6">
                Create your first recipe and share it with the community!
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Recipe
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recipes;
