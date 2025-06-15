
import React, { useState } from 'react';
import { ArrowLeft, Camera, BarChart3, Utensils, TrendingUp, Calendar, MessageCircle, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { dummyTodayStats, dummyRecentMeals, dummyRecipes } from '@/data/dummyData';

const Demo = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSections = [
    {
      id: 'food-logging',
      title: 'AI Food Recognition',
      description: 'See how our AI instantly identifies food from photos',
      icon: <Camera className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      title: 'Nutrition Analytics',
      description: 'Explore detailed nutrition tracking and insights',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'meal-planning',
      title: 'Smart Meal Planning',
      description: 'Discover AI-powered meal recommendations',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'ai-chat',
      title: 'Nutrition Coach Chat',
      description: 'Experience personalized nutrition guidance',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const foodRecognitionSteps = [
    { image: '/api/placeholder/300/200', text: 'User takes a photo of their meal' },
    { image: '/api/placeholder/300/200', text: 'AI processes and analyzes the image' },
    { image: '/api/placeholder/300/200', text: 'Food items are automatically identified' },
    { image: '/api/placeholder/300/200', text: 'Nutrition information is calculated' }
  ];

  const startDemo = (demoId: string) => {
    setActiveDemo(demoId);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                NutriTracker Demo
              </span>
            </Link>
            
            <Link to="/about">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Experience NutriTracker
          </h1>
          <p className="text-xl mb-8 text-gray-700 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Try our key features with sample data and see how easy nutrition tracking can be
          </p>
        </div>
      </section>

      {/* Demo Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {demoSections.map((section, index) => (
              <AnimatedCard
                key={section.id}
                className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg cursor-pointer"
                animationDelay={index * 100}
                hoverEffect="lift"
                onClick={() => startDemo(section.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                    {section.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{section.title}</CardTitle>
                  <CardDescription className="text-sm">{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>

          {/* Active Demo Display */}
          {activeDemo && (
            <div className="mt-12">
              <AnimatedCard className="bg-white/90 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader className="text-center border-b">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {demoSections.find(s => s.id === activeDemo)?.title} Demo
                  </CardTitle>
                  <Button variant="outline" onClick={resetDemo} className="mt-2">
                    Close Demo
                  </Button>
                </CardHeader>
                <CardContent className="p-8">
                  {activeDemo === 'food-logging' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">AI Food Recognition Process</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                          {foodRecognitionSteps.map((step, index) => (
                            <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                              currentStep >= index ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}>
                              <img src={step.image} alt={`Step ${index + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                              <p className="text-sm text-gray-600">{step.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <Button 
                            onClick={nextStep} 
                            disabled={currentStep >= foodRecognitionSteps.length - 1}
                            className="mr-2"
                          >
                            {currentStep >= foodRecognitionSteps.length - 1 ? 'Complete' : 'Next Step'}
                          </Button>
                          <Button variant="outline" onClick={() => setCurrentStep(0)}>
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemo === 'analytics' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-center mb-6">Today's Nutrition Summary</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-gray-600">Calories</h4>
                            <p className="text-2xl font-bold text-green-600">{dummyTodayStats.calories}</p>
                            <p className="text-sm text-gray-500">/ {dummyTodayStats.calorieGoal}</p>
                            <Progress value={(dummyTodayStats.calories / dummyTodayStats.calorieGoal) * 100} className="mt-2" />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-gray-600">Protein</h4>
                            <p className="text-2xl font-bold text-blue-600">{dummyTodayStats.protein}g</p>
                            <p className="text-sm text-gray-500">/ {dummyTodayStats.proteinGoal}g</p>
                            <Progress value={(dummyTodayStats.protein / dummyTodayStats.proteinGoal) * 100} className="mt-2" />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-gray-600">Carbs</h4>
                            <p className="text-2xl font-bold text-orange-600">{dummyTodayStats.carbs}g</p>
                            <p className="text-sm text-gray-500">/ {dummyTodayStats.carbGoal}g</p>
                            <Progress value={(dummyTodayStats.carbs / dummyTodayStats.carbGoal) * 100} className="mt-2" />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-gray-600">Fat</h4>
                            <p className="text-2xl font-bold text-purple-600">{dummyTodayStats.fat}g</p>
                            <p className="text-sm text-gray-500">/ {dummyTodayStats.fatGoal}g</p>
                            <Progress value={(dummyTodayStats.fat / dummyTodayStats.fatGoal) * 100} className="mt-2" />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-4">Recent Meals</h4>
                        <div className="space-y-3">
                          {dummyRecentMeals.map((meal) => (
                            <Card key={meal.id}>
                              <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold">{meal.meal}</h5>
                                  <p className="text-gray-600">{meal.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{meal.calories} cal</p>
                                  <p className="text-sm text-gray-500">{meal.time}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDemo === 'meal-planning' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-center mb-6">Recommended Recipes</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dummyRecipes.slice(0, 6).map((recipe) => (
                          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover rounded mb-3" />
                              <h4 className="font-semibold mb-2">{recipe.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                              <div className="flex justify-between items-center mb-3">
                                <Badge variant="secondary">{recipe.calories} cal</Badge>
                                <Badge variant="outline">{recipe.cookTime}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {recipe.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeDemo === 'ai-chat' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-center mb-6">AI Nutrition Coach Demo</h3>
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">Hello! I'm your AI nutrition coach. How can I help you today?</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 justify-end">
                            <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">I want to lose weight. What should I eat for dinner?</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">You</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">Great goal! For weight loss, I recommend a lean protein with vegetables. Try grilled chicken with roasted broccoli and quinoa. This provides about 450 calories with 35g protein. Would you like the full recipe?</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 justify-end">
                            <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">Yes, please! And can you suggest a healthy snack too?</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">You</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm">Perfect! I'll send you the grilled chicken recipe. For a healthy snack, try Greek yogurt with berries - it's high in protein and will keep you satisfied. Both meals align with your weight loss goals!</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-4">
                          This is a sample conversation. The actual AI coach provides personalized responses based on your profile and goals.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Ready to Start Your Own Journey?
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Sign up now and experience all these features with your own data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;
