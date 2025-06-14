
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietType: 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  allergies: string[];
}

export const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const { updateProfile } = useProfile();
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const calculateCalories = (weight: number, height: number, age: number, gender: string, activityLevel: string, goal: string) => {
    // Harris-Benedict Equation
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity factor
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    let tdee = bmr * (activityFactors[activityLevel as keyof typeof activityFactors] || 1.2);

    // Adjust for goal
    if (goal === 'lose_weight') tdee -= 500; // 1 lb per week
    if (goal === 'gain_weight') tdee += 500; // 1 lb per week

    return Math.round(tdee);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const calories = calculateCalories(
      data.weight || 70,
      data.height || 170,
      data.age || 30,
      data.gender || 'other',
      data.activityLevel || 'moderately_active',
      data.goal || 'maintain_weight'
    );

    const profileData = {
      name: data.name,
      age: data.age,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      activity_level: data.activityLevel,
      diet_type: data.dietType,
      daily_calories: calories,
      protein_goal: Math.round(calories * 0.25 / 4), // 25% of calories from protein
      carbs_goal: Math.round(calories * 0.45 / 4), // 45% from carbs
      fat_goal: Math.round(calories * 0.30 / 9), // 30% from fat
      allergies: data.allergies
    };

    updateProfile(profileData);
    toast({
      title: "Profile Created!",
      description: "Your nutrition goals have been calculated based on your information."
    });
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={data.name || ''}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age || ''}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select onValueChange={(value) => setData({ ...data, gender: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Physical Measurements</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={data.weight || ''}
                  onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) })}
                  placeholder="Enter your weight in kg"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={data.height || ''}
                  onChange={(e) => setData({ ...data, height: parseFloat(e.target.value) })}
                  placeholder="Enter your height in cm"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Lifestyle & Goals</h2>
            <div className="space-y-4">
              <div>
                <Label>Activity Level</Label>
                <Select onValueChange={(value) => setData({ ...data, activityLevel: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (light exercise)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (moderate exercise)</SelectItem>
                    <SelectItem value="very_active">Very Active (hard exercise)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (very hard exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primary Goal</Label>
                <Select onValueChange={(value) => setData({ ...data, goal: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                    <SelectItem value="gain_weight">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Dietary Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label>Diet Type</Label>
                <Select onValueChange={(value) => setData({ ...data, dietType: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your diet type" />
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
              <div>
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Input
                  id="allergies"
                  value={data.allergies?.join(', ') || ''}
                  onChange={(e) => setData({ 
                    ...data, 
                    allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., nuts, dairy, gluten"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Nutrition Tracker</CardTitle>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {step === totalSteps ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
