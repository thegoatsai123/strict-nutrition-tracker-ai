
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { barcodeService } from '@/services/barcode';
import { Search, Plus, Scan, X } from 'lucide-react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  nutrition: NutritionInfo;
  servingSize: string;
  servingUnit: string;
}

export const FoodLogger = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState('breakfast');
  const [isSearching, setIsSearching] = useState(false);
  const [barcode, setBarcode] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();

  const searchFoods = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Search USDA database
      const usdaResponse = await apiService.searchFoods({
        query: searchQuery,
        pageSize: 10
      });

      // Search Open Food Facts for packaged foods
      const barcodeResponse = await barcodeService.searchProducts(searchQuery);

      const results: FoodItem[] = [];

      // Process USDA results
      if (usdaResponse.success && usdaResponse.data) {
        usdaResponse.data.foods.forEach((food: any) => {
          const nutrients = food.foodNutrients || [];
          const getnutrient = (id: number) => {
            const nutrient = nutrients.find((n: any) => n.nutrientId === id);
            return nutrient ? nutrient.value || 0 : 0;
          };

          results.push({
            id: `usda-${food.fdcId}`,
            name: food.description,
            brand: food.brandOwner,
            nutrition: {
              calories: getnutrient(1008),
              protein: getnutrient(1003),
              carbs: getnutrient(1005),
              fat: getnutrient(1004),
              fiber: getnutrient(1079),
              sugar: getnutrient(2000),
              sodium: getnutrient(1093)
            },
            servingSize: '100',
            servingUnit: 'g'
          });
        });
      }

      // Process Open Food Facts results
      if (barcodeResponse.success && barcodeResponse.data) {
        barcodeResponse.data.products.forEach((product: any) => {
          const n = product.nutriments;
          results.push({
            id: `off-${product.code}`,
            name: product.product_name,
            brand: product.brands,
            nutrition: {
              calories: (n.energy_100g || 0) / 4.184, // Convert kJ to kcal
              protein: n.proteins_100g || 0,
              carbs: n.carbohydrates_100g || 0,
              fat: n.fat_100g || 0,
              fiber: n.fiber_100g || 0,
              sugar: n.sugars_100g || 0,
              sodium: n.sodium_100g || 0
            },
            servingSize: '100',
            servingUnit: 'g'
          });
        });
      }

      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term",
        });
      }
    } catch (error) {
      console.error('Food search error:', error);
      toast({
        title: "Search failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchByBarcode = async () => {
    if (!barcode.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await barcodeService.searchByBarcode(barcode);
      
      if (response.success && response.data) {
        const product = response.data;
        const n = product.nutriments;
        
        const foodItem: FoodItem = {
          id: `barcode-${product.code}`,
          name: product.product_name,
          brand: product.brands,
          nutrition: {
            calories: (n.energy_100g || 0) / 4.184,
            protein: n.proteins_100g || 0,
            carbs: n.carbohydrates_100g || 0,
            fat: n.fat_100g || 0,
            fiber: n.fiber_100g || 0,
            sugar: n.sugars_100g || 0,
            sodium: n.sodium_100g || 0
          },
          servingSize: '100',
          servingUnit: 'g'
        };
        
        setSearchResults([foodItem]);
        toast({
          title: "Product found!",
          description: product.product_name,
        });
      } else {
        toast({
          title: "Product not found",
          description: "This barcode is not in our database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Barcode search error:', error);
      toast({
        title: "Barcode search failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const logFood = async () => {
    if (!selectedFood || !user) return;

    const multiplier = parseFloat(quantity) || 1;
    
    try {
      const { error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        fdc_id: parseInt(selectedFood.id.split('-')[1]) || 0,
        food_description: selectedFood.name,
        brand_owner: selectedFood.brand,
        quantity: multiplier,
        unit: selectedFood.servingUnit,
        meal_type: mealType,
        calories: selectedFood.nutrition.calories * multiplier,
        protein: selectedFood.nutrition.protein * multiplier,
        carbohydrates: selectedFood.nutrition.carbs * multiplier,
        fat: selectedFood.nutrition.fat * multiplier,
        fiber: selectedFood.nutrition.fiber ? selectedFood.nutrition.fiber * multiplier : null,
        sugar: selectedFood.nutrition.sugar ? selectedFood.nutrition.sugar * multiplier : null,
        sodium: selectedFood.nutrition.sodium ? selectedFood.nutrition.sodium * multiplier : null,
        consumed_at: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Food logged successfully!",
        description: `${selectedFood.name} added to ${mealType}`,
      });

      // Reset form
      setSelectedFood(null);
      setQuantity('1');
      setSearchResults([]);
      setSearchQuery('');
      setBarcode('');
    } catch (error: any) {
      console.error('Error logging food:', error);
      toast({
        title: "Failed to log food",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Food</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchFoods()}
              className="flex-1"
            />
            <Button onClick={searchFoods} disabled={isSearching}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchByBarcode()}
              className="flex-1"
            />
            <Button onClick={searchByBarcode} disabled={isSearching} variant="outline">
              <Scan className="w-4 h-4 mr-2" />
              Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((food) => (
                <div 
                  key={food.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedFood?.id === food.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedFood(food)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{food.name}</h4>
                      {food.brand && <p className="text-sm text-gray-600">{food.brand}</p>}
                      <p className="text-xs text-gray-500">
                        Per {food.servingSize}{food.servingUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Math.round(food.nutrition.calories)} cal</p>
                      <div className="flex gap-1 text-xs text-gray-600">
                        <Badge variant="secondary">P: {Math.round(food.nutrition.protein)}g</Badge>
                        <Badge variant="secondary">C: {Math.round(food.nutrition.carbs)}g</Badge>
                        <Badge variant="secondary">F: {Math.round(food.nutrition.fat)}g</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Food Section */}
      {selectedFood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Log Food
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedFood(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{selectedFood.name}</h4>
              {selectedFood.brand && <p className="text-sm text-gray-600">{selectedFood.brand}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meal</label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium mb-2">Nutrition Summary</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Calories: {Math.round(selectedFood.nutrition.calories * parseFloat(quantity || '1'))}</div>
                <div>Protein: {Math.round(selectedFood.nutrition.protein * parseFloat(quantity || '1'))}g</div>
                <div>Carbs: {Math.round(selectedFood.nutrition.carbs * parseFloat(quantity || '1'))}g</div>
                <div>Fat: {Math.round(selectedFood.nutrition.fat * parseFloat(quantity || '1'))}g</div>
              </div>
            </div>

            <Button onClick={logFood} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Log Food
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
