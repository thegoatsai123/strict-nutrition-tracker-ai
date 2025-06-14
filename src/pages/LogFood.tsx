import { useState, useRef } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FoodRecognitionUpload } from '@/components/FoodRecognition/FoodRecognitionUpload';
import { FloatingElement, ParticleBackground } from '@/components/ui/floating-elements';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { NutritionCalculator } from '@/utils/nutrition';
import { IFoodItem, IUSDASearchResponse, IApiResponse } from '@/types';
import { Camera, Search, Mic, Plus, Sparkles, Brain, Zap } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import { useFoodRecognition } from '@/hooks/useFoodRecognition';

const LogFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<{ className: string; confidence: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { recognizeFood, lastResult, getAvailableProviders } = useFoodRecognition();

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

  const handleImageUpload = async (file: File) => {
    setSelectedFile(file);
    setIsRecognizing(true);
    setRecognitionResult(null);

    try {
      const result = await recognizeFood(file);
      
      if (result.success && result.predictions.length > 0) {
        const topPrediction = result.predictions[0];
        if (topPrediction.confidence > 0.5) {
          setRecognitionResult(topPrediction);
          setSearchQuery(topPrediction.className);
          
          setTimeout(() => {
            handleSearch();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Food recognition error:', error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const addFoodToLog = async (foodItem: IFoodItem) => {
    try {
      const nutritionalData = NutritionCalculator.extractNutritionalData(foodItem, 100);
      
      toast({
        title: "Food Added Successfully! ✨",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleBackground count={40} />
      <Navbar />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FloatingElement delay={0.2}>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 border border-green-200">
              <Brain className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-700">
                ML-Powered Food Recognition ({getAvailableProviders().length} models active)
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Log Your Food
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use advanced ML models, voice commands, or manual search to track your nutrition
            </p>
          </div>
        </FloatingElement>

        {/* AI Food Recognition Section */}
        <FloatingElement delay={0.4}>
          <GlassCard className="mb-8 p-8" gradient>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI Food Recognition</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Upload a photo and let our ML models identify your food instantly
              </p>
            </div>
            
            <FoodRecognitionUpload 
              onImageUpload={handleImageUpload}
              isProcessing={isRecognizing}
              prediction={recognitionResult}
            />
          </GlassCard>
        </FloatingElement>

        {/* Search Input Section */}
        <FloatingElement delay={0.6}>
          <GlassCard className="mb-8">
            <CardHeader>
              <div className="flex items-center">
                <Search className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <CardTitle className="text-xl">Manual Food Search</CardTitle>
                  <CardDescription>
                    Search our comprehensive USDA database with over 350,000 food items
                  </CardDescription>
                </div>
              </div>
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
                    className="w-full h-12 text-lg border-2 focus:border-green-400 transition-colors"
                  />
                </div>
                <AnimatedButton 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  size="lg"
                  className="px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isSearching ? 'Searching...' : 'Search'}
                </AnimatedButton>
              </div>

              <div className="flex gap-4">
                <AnimatedButton
                  variant="outline"
                  className="flex-1"
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                  animation={isListening ? "pulse" : "none"}
                >
                  <Mic className={`h-4 w-4 mr-2 ${isListening ? 'text-red-500' : ''}`} />
                  {isListening ? 'Listening...' : 'Voice Search'}
                </AnimatedButton>
                
                <AnimatedButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Pro Tip! 💡",
                      description: "Use the ML recognition above for the best experience!",
                    })
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  ML Models Ready
                </AnimatedButton>
              </div>
            </CardContent>
          </GlassCard>
        </FloatingElement>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <FloatingElement delay={0.8}>
            <GlassCard>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Sparkles className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <CardTitle className="text-xl">Search Results</CardTitle>
                      <CardDescription>
                        Found {searchResults.length} matching food items
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((food, index) => {
                    const nutritionalData = NutritionCalculator.extractNutritionalData(food, 100);
                    
                    return (
                      <FloatingElement key={food.fdcId} delay={1.0 + (index * 0.1)}>
                        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                                {food.description}
                              </h3>
                              {food.brandOwner && (
                                <p className="text-sm text-gray-600 mt-1">Brand: {food.brandOwner}</p>
                              )}
                              {food.foodCategory && (
                                <Badge variant="secondary" className="mt-2">
                                  {food.foodCategory}
                                </Badge>
                              )}
                            </div>
                            <AnimatedButton
                              onClick={() => addFoodToLog(food)}
                              variant="gradient"
                              className="ml-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Log
                            </AnimatedButton>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                              <span className="font-medium text-blue-800">Calories</span>
                              <p className="text-2xl font-bold text-blue-600">
                                {Math.round(nutritionalData.calories)}
                              </p>
                              <span className="text-xs text-blue-600">per 100g</span>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                              <span className="font-medium text-green-800">Protein</span>
                              <p className="text-2xl font-bold text-green-600">
                                {Math.round(nutritionalData.protein)}g
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
                              <span className="font-medium text-yellow-800">Carbs</span>
                              <p className="text-2xl font-bold text-yellow-600">
                                {Math.round(nutritionalData.carbohydrates)}g
                              </p>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
                              <span className="font-medium text-red-800">Fat</span>
                              <p className="text-2xl font-bold text-red-600">
                                {Math.round(nutritionalData.fat)}g
                              </p>
                            </div>
                          </div>
                        </div>
                      </FloatingElement>
                    );
                  })}
                </div>
              </CardContent>
            </GlassCard>
          </FloatingElement>
        )}

        {/* No Results Message */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <FloatingElement delay={1.0}>
            <GlassCard>
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-xl text-gray-600 mb-2">No food items found for "{searchQuery}"</p>
                <p className="text-gray-500 mb-6">
                  Try using different keywords, check your spelling, or use our ML recognition feature
                </p>
                <AnimatedButton variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </AnimatedButton>
              </CardContent>
            </GlassCard>
          </FloatingElement>
        )}
      </div>
    </div>
  );
};

export default LogFood;
