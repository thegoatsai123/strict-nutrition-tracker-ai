
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { NutritionCalculator } from '@/utils/nutrition';
import { IFoodItem, IUSDASearchResponse, IApiResponse } from '@/types';
import { Camera, Search, Mic, Plus } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';

const LogFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a food item to search for.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response: IApiResponse<IUSDASearchResponse> = await apiService.searchFoods({
        query: searchQuery,
        pageSize: 20,
        sortBy: 'dataType.keyword'
      });

      if (response.success && response.data) {
        setSearchResults(response.data.foods);
        toast({
          title: "Search Completed",
          description: `Found ${response.data.foods.length} food items.`
        });
      } else {
        toast({
          title: "Search Failed",
          description: response.error || "Unable to search for foods.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "An unexpected error occurred while searching.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Search Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Please speak the name of the food item."
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      toast({
        title: "Voice Recognition Complete",
        description: `Heard: "${transcript}"`
      });
      
      // Auto-search after voice input
      setTimeout(() => {
        handleSearch();
      }, 500);
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      toast({
        title: "Voice Recognition Error",
        description: "Unable to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    recognizeFood(file);
  };

  const recognizeFood = async (file: File) => {
    setIsRecognizing(true);
    try {
      const response = await apiService.recognizeFood(file);
      
      if (response.success && response.data) {
        const topPrediction = response.data.predictions[0];
        if (topPrediction && topPrediction.confidence > 0.5) {
          setSearchQuery(topPrediction.className);
          toast({
            title: "Food Recognized",
            description: `Detected: ${topPrediction.className} (${Math.round(topPrediction.confidence * 100)}% confidence)`
          });
          
          // Auto-search for recognized food
          setTimeout(() => {
            handleSearch();
          }, 500);
        } else {
          toast({
            title: "Low Confidence",
            description: "Unable to confidently identify the food. Please try manual search.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Recognition Failed",
          description: response.error || "Unable to recognize the food in the image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Food recognition error:', error);
      toast({
        title: "Recognition Error",
        description: "An error occurred while processing the image.",
        variant: "destructive"
      });
    } finally {
      setIsRecognizing(false);
    }
  };

  const addFoodToLog = async (foodItem: IFoodItem) => {
    try {
      // Calculate nutrition for 100g serving
      const nutritionalData = NutritionCalculator.extractNutritionalData(foodItem, 100);
      
      // Here you would typically save to your backend/database
      // For now, we'll just show a success message
      toast({
        title: "Food Added",
        description: `${foodItem.description} has been added to your food log.`
      });

      console.log('Food logged:', {
        foodItem,
        nutritionalData,
        quantity: 100,
        unit: 'g',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error adding food to log:', error);
      toast({
        title: "Error",
        description: "Unable to add food to log. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Your Food</h1>
          <p className="text-gray-600">Search, scan, or speak to add foods to your nutrition diary</p>
        </div>

        {/* Search Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Food Items</CardTitle>
            <CardDescription>
              Search our comprehensive USDA database with over 350,000 food items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for food items (e.g., 'chicken breast', 'apple')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="bg-green-600 hover:bg-green-700"
              >
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Alternative Input Methods */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleVoiceSearch}
                disabled={isListening}
                className="flex-1"
              >
                <Mic className={`h-4 w-4 mr-2 ${isListening ? 'text-red-500' : ''}`} />
                {isListening ? 'Listening...' : 'Voice Search'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecognizing}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isRecognizing ? 'Processing...' : 'Photo Recognition'}
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Selected image: {selectedFile.name}
                  {isRecognizing && " - Processing..."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} matching food items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((food) => {
                  const nutritionalData = NutritionCalculator.extractNutritionalData(food, 100);
                  
                  return (
                    <div key={food.fdcId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{food.description}</h3>
                          {food.brandOwner && (
                            <p className="text-sm text-gray-600">Brand: {food.brandOwner}</p>
                          )}
                          {food.foodCategory && (
                            <Badge variant="secondary" className="mt-1">
                              {food.foodCategory}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => addFoodToLog(food)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Log
                        </Button>
                      </div>
                      
                      {/* Nutrition Information */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-blue-50 p-2 rounded">
                          <span className="font-medium">Calories</span>
                          <p className="text-lg font-bold text-blue-600">
                            {Math.round(nutritionalData.calories)}
                          </p>
                          <span className="text-xs text-gray-500">per 100g</span>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <span className="font-medium">Protein</span>
                          <p className="text-lg font-bold text-green-600">
                            {Math.round(nutritionalData.protein)}g
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <span className="font-medium">Carbs</span>
                          <p className="text-lg font-bold text-yellow-600">
                            {Math.round(nutritionalData.carbohydrates)}g
                          </p>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <span className="font-medium">Fat</span>
                          <p className="text-lg font-bold text-red-600">
                            {Math.round(nutritionalData.fat)}g
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results Message */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No food items found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">
                Try using different keywords or check your spelling
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LogFood;
