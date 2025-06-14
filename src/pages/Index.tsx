
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingElement, ParticleBackground } from '@/components/ui/floating-elements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { IRecipe, IApiResponse } from '@/types';
import { Camera, Search, BarChart, Users, Utensils, TrendingUp, Brain, Sparkles, Zap } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';

const Index = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedRecipes();
  }, []);

  const loadFeaturedRecipes = async () => {
    try {
      const response: IApiResponse<{ recipes: IRecipe[] }> = await apiService.getRandomRecipes(['healthy', 'quick'], 3);
      if (response.success && response.data) {
        setFeaturedRecipes(response.data.recipes);
      }
    } catch (error) {
      console.error('Error loading featured recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: 'AI Food Recognition',
      description: 'Advanced CNN model trained on Food-101 dataset for instant food identification from photos.',
      href: '/log-food',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Smart Food Search',
      description: 'Search our comprehensive USDA database with over 350,000 food items for accurate nutrition data.',
      href: '/log-food',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <BarChart className="h-8 w-8 text-green-600" />,
      title: 'Detailed Analytics',
      description: 'Track your nutrition progress with detailed charts and insights tailored to your health goals.',
      href: '/dashboard',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: 'Recipe Recommendations',
      description: 'Discover healthy recipes based on your dietary preferences and nutritional needs.',
      href: '/recipes',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: 'Community Support',
      description: 'Connect with like-minded individuals and share your nutrition journey with our community.',
      href: '/community',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your health metrics and see your improvement over time with comprehensive tracking.',
      href: '/dashboard',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleBackground count={50} />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <ParticleBackground count={30} className="bg-white/10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FloatingElement delay={0.2}>
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
                <Sparkles className="w-5 h-5 text-yellow-300 mr-2" />
                <span className="text-lg font-semibold">AI-Powered Nutrition Revolution</span>
              </div>
            </FloatingElement>
            
            <FloatingElement delay={0.4}>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Smart Nutrition
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Tracking System
                </span>
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.6}>
              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/90">
                Experience the future of nutrition tracking with cutting-edge AI food recognition, 
                comprehensive analytics, and personalized recommendations. Transform your health journey today.
              </p>
            </FloatingElement>
            
            <FloatingElement delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <AnimatedButton asChild size="lg" variant="gradient" animation="bounce" className="text-lg px-10 py-4 bg-white text-purple-600 hover:bg-gray-100">
                  <Link to="/log-food">
                    <Brain className="w-5 h-5 mr-2" />
                    Start AI Tracking
                  </Link>
                </AnimatedButton>
                <AnimatedButton asChild variant="outline" size="lg" className="text-lg px-10 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                  <Link to="/dashboard">
                    <BarChart className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Link>
                </AnimatedButton>
              </div>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement delay={1.0}>
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 border border-green-200">
                <Zap className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-700">Powerful Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Revolutionary Health Technology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive nutrition tracker provides everything you need to achieve your health goals with cutting-edge AI
              </p>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FloatingElement key={index} delay={1.2 + (index * 0.1)}>
                <GlassCard className="p-8 h-full group hover:scale-105 transition-all duration-500">
                  <div className="text-center space-y-6">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                    </div>
                    <AnimatedButton asChild variant="outline" className="w-full group-hover:border-green-400">
                      <Link to={feature.href}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Explore Feature
                      </Link>
                    </AnimatedButton>
                  </div>
                </GlassCard>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="relative z-10 py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement delay={1.8}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6 border border-orange-200">
                <Utensils className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold text-orange-700">Curated Recipes</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Featured Healthy Recipes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover delicious and nutritious recipes curated for your health goals
              </p>
            </div>
          </FloatingElement>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <FloatingElement key={i} delay={2.0 + (i * 0.1)}>
                  <GlassCard className="h-80 animate-pulse">
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </GlassCard>
                </FloatingElement>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <FloatingElement key={recipe.id} delay={2.0 + (index * 0.1)}>
                  <GlassCard className="overflow-hidden group hover:scale-105 transition-all duration-500">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                          {recipe.readyInMinutes} mins
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                          {recipe.servings} servings
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                          ❤️ {recipe.aggregateLikes}
                        </span>
                      </div>
                      <AnimatedButton asChild className="w-full" variant="gradient">
                        <Link to={`/recipes/${recipe.id}`}>
                          <Utensils className="w-4 h-4 mr-2" />
                          View Recipe
                        </Link>
                      </AnimatedButton>
                    </div>
                  </GlassCard>
                </FloatingElement>
              ))}
            </div>
          )}

          <FloatingElement delay={2.4}>
            <div className="text-center mt-16">
              <AnimatedButton asChild variant="outline" size="lg" className="px-10 py-4">
                <Link to="/recipes">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore All Recipes
                </Link>
              </AnimatedButton>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <FloatingElement delay={2.6}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-12 text-center" gradient>
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Ready to Transform Your Health?
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                  Join thousands of users who have revolutionized their nutrition tracking with our 
                  AI-powered platform. Start your journey to better health today.
                </p>
              </div>
              
              <div className="space-y-4">
                <AnimatedButton asChild size="lg" variant="gradient" animation="pulse" className="text-lg px-12 py-4">
                  <Link to="/log-food">
                    <Camera className="w-5 h-5 mr-2" />
                    Start AI Tracking Now
                  </Link>
                </AnimatedButton>
                <p className="text-sm text-gray-600">
                  Free to use • No credit card required • Advanced AI included
                </p>
              </div>
            </GlassCard>
          </div>
        </FloatingElement>
      </section>
    </div>
  );
};

export default Index;
