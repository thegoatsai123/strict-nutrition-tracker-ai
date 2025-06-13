
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/api';
import { IRecipe, IApiResponse } from '@/types';
import { Camera, Search, BarChart, Users, Utensils, TrendingUp } from 'lucide-react';
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
      icon: <Camera className="h-8 w-8 text-green-600" />,
      title: 'Food Recognition',
      description: 'Take a photo of your meal and get instant nutrition information using AI-powered food recognition.',
      href: '/log-food'
    },
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Smart Food Search',
      description: 'Search our comprehensive USDA database with over 350,000 food items for accurate nutrition data.',
      href: '/log-food'
    },
    {
      icon: <BarChart className="h-8 w-8 text-purple-600" />,
      title: 'Detailed Analytics',
      description: 'Track your nutrition progress with detailed charts and insights tailored to your health goals.',
      href: '/dashboard'
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: 'Recipe Recommendations',
      description: 'Discover healthy recipes based on your dietary preferences and nutritional needs.',
      href: '/recipes'
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: 'Community Support',
      description: 'Connect with like-minded individuals and share your nutrition journey with our community.',
      href: '/community'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your health metrics and see your improvement over time with comprehensive tracking.',
      href: '/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Nutrition Tracking
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Track your nutrition with AI-powered food recognition, comprehensive analytics, 
              and personalized recommendations. Start your healthy journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/log-food">Start Tracking</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Health
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive nutrition tracker provides everything you need to achieve your health goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={feature.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Healthy Recipes
            </h2>
            <p className="text-xl text-gray-600">
              Discover delicious and nutritious recipes curated for you
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>🕒 {recipe.readyInMinutes} mins</span>
                        <span>👥 {recipe.servings} servings</span>
                        <span>❤️ {recipe.aggregateLikes}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={`/recipes/${recipe.id}`}>View Recipe</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/recipes">View All Recipes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of users who have already started their healthy journey with our smart nutrition tracker.
          </p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/log-food">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
