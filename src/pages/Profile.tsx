
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, Heart, Activity, Target, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, isLoading, isUpdating } = useProfile();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    diet_type: '',
    daily_calories: '',
    protein_goal: '',
    carbs_goal: '',
    fat_goal: '',
    allergies: [] as string[],
    disliked_ingredients: [] as string[]
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newDisliked, setNewDisliked] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        gender: profile.gender || '',
        activity_level: profile.activity_level || '',
        diet_type: profile.diet_type || '',
        daily_calories: profile.daily_calories?.toString() || '',
        protein_goal: profile.protein_goal?.toString() || '',
        carbs_goal: profile.carbs_goal?.toString() || '',
        fat_goal: profile.fat_goal?.toString() || '',
        allergies: profile.allergies || [],
        disliked_ingredients: profile.disliked_ingredients || []
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      gender: formData.gender as 'male' | 'female' | 'other' | undefined,
      activity_level: formData.activity_level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | undefined,
      diet_type: formData.diet_type as 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | undefined,
      daily_calories: formData.daily_calories ? parseInt(formData.daily_calories) : undefined,
      protein_goal: formData.protein_goal ? parseInt(formData.protein_goal) : undefined,
      carbs_goal: formData.carbs_goal ? parseInt(formData.carbs_goal) : undefined,
      fat_goal: formData.fat_goal ? parseInt(formData.fat_goal) : undefined,
      allergies: formData.allergies,
      disliked_ingredients: formData.disliked_ingredients
    };
    updateProfile(updatedData);
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addDisliked = () => {
    if (newDisliked.trim() && !formData.disliked_ingredients.includes(newDisliked.trim())) {
      setFormData(prev => ({
        ...prev,
        disliked_ingredients: [...prev.disliked_ingredients, newDisliked.trim()]
      }));
      setNewDisliked('');
    }
  };

  const removeDisliked = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      disliked_ingredients: prev.disliked_ingredients.filter(i => i !== ingredient)
    }));
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Profile Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-lg md:text-xl">
                  {getUserInitials(profile?.name || user?.email || 'U')}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-lg md:text-xl">{profile?.name || 'User'}</CardTitle>
            <CardDescription className="text-sm">{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              {profile?.age && (
                <div className="p-3 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{profile.age} years</p>
                </div>
              )}
              {profile?.weight && (
                <div className="p-3 bg-muted rounded-lg">
                  <Activity className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{profile.weight} kg</p>
                </div>
              )}
            </div>
            {profile?.diet_type && profile.diet_type !== 'none' && (
              <div className="text-center">
                <Badge variant="secondary" className="capitalize">
                  {profile.diet_type} Diet
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="Enter your weight"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="Enter your height"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  <Select value={formData.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                      <SelectItem value="extremely_active">Extremely Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Nutrition Goals */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Nutrition Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily_calories">Daily Calories</Label>
                    <Input
                      id="daily_calories"
                      type="number"
                      value={formData.daily_calories}
                      onChange={(e) => handleInputChange('daily_calories', e.target.value)}
                      placeholder="2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein_goal">Protein (g)</Label>
                    <Input
                      id="protein_goal"
                      type="number"
                      value={formData.protein_goal}
                      onChange={(e) => handleInputChange('protein_goal', e.target.value)}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs_goal">Carbs (g)</Label>
                    <Input
                      id="carbs_goal"
                      type="number"
                      value={formData.carbs_goal}
                      onChange={(e) => handleInputChange('carbs_goal', e.target.value)}
                      placeholder="250"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat_goal">Fat (g)</Label>
                    <Input
                      id="fat_goal"
                      type="number"
                      value={formData.fat_goal}
                      onChange={(e) => handleInputChange('fat_goal', e.target.value)}
                      placeholder="67"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diet_type">Diet Type</Label>
                  <Select value={formData.diet_type} onValueChange={(value) => handleInputChange('diet_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific diet</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Ketogenic</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Allergies and Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Dietary Restrictions
                </h3>
                
                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy (e.g., nuts, dairy)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <Button type="button" onClick={addAllergy} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => removeAllergy(allergy)}>
                        {allergy} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Disliked Ingredients */}
                <div className="space-y-3">
                  <Label>Disliked Ingredients</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDisliked}
                      onChange={(e) => setNewDisliked(e.target.value)}
                      placeholder="Add disliked ingredient"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDisliked())}
                    />
                    <Button type="button" onClick={addDisliked} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.disliked_ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeDisliked(ingredient)}>
                        {ingredient} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating} className="w-full md:w-auto">
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
