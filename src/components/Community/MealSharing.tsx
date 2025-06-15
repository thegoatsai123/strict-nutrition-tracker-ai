
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Heart, MessageCircle, Share2, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SharedMeal {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time: number;
  servings: number;
  tags: string[];
  user_id: string;
  author_name: string;
  author_avatar?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_liked: boolean;
}

export const MealSharing: React.FC = () => {
  const [meals, setMeals] = useState<SharedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    title: '',
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prep_time: 0,
    servings: 1,
    tags: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSharedMeals();
  }, []);

  const loadSharedMeals = async () => {
    setLoading(true);
    try {
      // Mock data for now - in real app would fetch from Supabase
      const mockMeals: SharedMeal[] = [
        {
          id: '1',
          title: 'Protein-Packed Quinoa Bowl',
          description: 'Delicious quinoa bowl with grilled chicken, avocado, and fresh vegetables. Perfect for post-workout!',
          calories: 520,
          protein: 35,
          carbs: 45,
          fat: 18,
          prep_time: 25,
          servings: 2,
          tags: ['healthy', 'protein', 'quinoa', 'post-workout'],
          user_id: 'user1',
          author_name: 'Sarah Johnson',
          likes_count: 23,
          comments_count: 8,
          created_at: '2024-01-15T10:30:00Z',
          is_liked: false
        },
        {
          id: '2',
          title: 'Mediterranean Salmon',
          description: 'Baked salmon with herbs, olive oil, and lemon. Served with roasted vegetables.',
          calories: 480,
          protein: 42,
          carbs: 12,
          fat: 28,
          prep_time: 30,
          servings: 1,
          tags: ['keto', 'mediterranean', 'salmon', 'omega-3'],
          user_id: 'user2',
          author_name: 'Mike Chen',
          likes_count: 31,
          comments_count: 12,
          created_at: '2024-01-14T18:45:00Z',
          is_liked: true
        }
      ];
      setMeals(mockMeals);
    } catch (error) {
      console.error('Error loading shared meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareMeal = async () => {
    if (!user || !newMeal.title) {
      toast({
        title: "Missing information",
        description: "Please fill in the meal title.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mock sharing - in real app would save to Supabase
      console.log('Sharing meal:', newMeal);
      
      setNewMeal({
        title: '',
        description: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        prep_time: 0,
        servings: 1,
        tags: ''
      });
      setShowShareModal(false);
      
      toast({
        title: "Meal shared!",
        description: "Your meal has been shared with the community.",
      });
      
      await loadSharedMeals();
    } catch (error: any) {
      toast({
        title: "Error sharing meal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleLike = async (mealId: string) => {
    try {
      setMeals(meals.map(meal => 
        meal.id === mealId 
          ? { 
              ...meal, 
              is_liked: !meal.is_liked,
              likes_count: meal.is_liked ? meal.likes_count - 1 : meal.likes_count + 1
            }
          : meal
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Meals</h2>
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogTrigger asChild>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Share Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Meal title"
                value={newMeal.title}
                onChange={(e) => setNewMeal({ ...newMeal, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newMeal.description}
                onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Calories"
                  value={newMeal.calories || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Protein (g)"
                  value={newMeal.protein || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Carbs (g)"
                  value={newMeal.carbs || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Fat (g)"
                  value={newMeal.fat || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Prep time (min)"
                  value={newMeal.prep_time || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, prep_time: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Servings"
                  value={newMeal.servings || ''}
                  onChange={(e) => setNewMeal({ ...newMeal, servings: Number(e.target.value) })}
                />
              </div>
              <Input
                placeholder="Tags (comma separated)"
                value={newMeal.tags}
                onChange={(e) => setNewMeal({ ...newMeal, tags: e.target.value })}
              />
              <Button onClick={shareMeal} className="w-full">
                Share Meal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={meal.author_avatar} />
                  <AvatarFallback>{meal.author_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{meal.author_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold">{meal.title}</h4>
                <p className="text-muted-foreground">{meal.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {meal.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{meal.calories}</div>
                  <div className="text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{meal.protein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meal.prep_time}m
                  </div>
                  <div className="text-muted-foreground">Prep time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    {meal.servings}
                  </div>
                  <div className="text-muted-foreground">Servings</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(meal.id)}
                  className={meal.is_liked ? "text-red-500" : ""}
                >
                  <Heart className={`mr-1 h-4 w-4 ${meal.is_liked ? "fill-current" : ""}`} />
                  {meal.likes_count}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  {meal.comments_count}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
