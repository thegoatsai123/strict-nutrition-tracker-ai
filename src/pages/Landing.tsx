
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, LogIn, UserPlus } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">NutriTracker</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/signin">
                <Button variant="outline" className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Nutrition Tracking
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your nutrition, analyze your meals, and get AI-powered insights 
            to reach your health goals with our comprehensive nutrition tracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Healthy Living
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to track, 
              analyze, and improve your nutrition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowUp className="w-5 h-5 mr-2 text-green-500" />
                  Food Logging
                </CardTitle>
                <CardDescription>
                  Log your meals with text, voice, or photo recognition using real USDA data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Voice-powered food entry</li>
                  <li>• AI photo recognition</li>
                  <li>• USDA nutrition database</li>
                  <li>• Barcode scanning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowDown className="w-5 h-5 mr-2 text-blue-500" />
                  Analytics & Insights
                </CardTitle>
                <CardDescription>
                  Get detailed nutritional analysis and personalized recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Macro & micronutrient tracking</li>
                  <li>• Progress visualization</li>
                  <li>• AI-powered insights</li>
                  <li>• Goal setting & tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2 text-purple-500" />
                  Community & Recipes
                </CardTitle>
                <CardDescription>
                  Connect with others and discover healthy recipes tailored to your goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Recipe recommendations</li>
                  <li>• Community forums</li>
                  <li>• Progress sharing</li>
                  <li>• Expert advice</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Health Journey Today
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their health with our 
            AI-powered nutrition tracking platform.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold">NutriTracker</span>
            </div>
            <p className="text-gray-400">
              © 2024 NutriTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
