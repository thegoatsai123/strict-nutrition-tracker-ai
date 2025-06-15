
import { ArrowLeft, Camera, BarChart3, Users, Brain, Shield, Target, ChevronRight, Play, User, Upload, Utensils, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';

const About = () => {
  const features = [
    {
      icon: <Camera className="w-8 h-8 text-green-500" />,
      title: "AI-Powered Food Recognition",
      description: "Our advanced machine learning model, trained on the Food-101 dataset, can instantly identify food items from photos with high accuracy."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "Comprehensive Analytics",
      description: "Track your nutrition intake with detailed charts and insights, helping you understand your eating patterns and progress toward health goals."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Community Support",
      description: "Connect with fellow health enthusiasts, share recipes, and find motivation in our supportive community platform."
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: "Smart Recommendations",
      description: "Get personalized meal suggestions and nutrition advice based on your dietary preferences and health goals."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Privacy First",
      description: "Your health data is secure with us. We use industry-standard encryption and never share your personal information."
    },
    {
      icon: <Target className="w-8 h-8 text-indigo-500" />,
      title: "Goal Tracking",
      description: "Set and monitor your nutrition goals with our intuitive tracking system that adapts to your lifestyle."
    }
  ];

  const steps = [
    {
      number: 1,
      icon: <User className="w-6 h-6" />,
      title: "Sign Up & Create Profile",
      description: "Create your account with email and set up your profile with personal goals, dietary preferences, and health information.",
      details: [
        "Click 'Sign Up' and enter your email and password",
        "Verify your email address",
        "Complete your profile with age, weight, height, and activity level",
        "Set your nutrition goals (weight loss, muscle gain, maintenance)",
        "Choose dietary preferences (vegetarian, keto, etc.)"
      ]
    },
    {
      number: 2,
      icon: <Camera className="w-6 h-6" />,
      title: "Log Your First Meal",
      description: "Take a photo of your food or manually search and add items to start tracking your nutrition intake.",
      details: [
        "Go to 'Log Food' from the main menu",
        "Take a photo of your meal using the camera feature",
        "Our AI will automatically identify the food items",
        "Review and confirm the detected foods",
        "Adjust portion sizes if needed",
        "Add any missed items manually using the search function"
      ]
    },
    {
      number: 3,
      icon: <Upload className="w-6 h-6" />,
      title: "Track Throughout the Day",
      description: "Continue logging all your meals, snacks, and water intake to build a complete picture of your nutrition.",
      details: [
        "Log breakfast, lunch, dinner, and snacks",
        "Use the water tracker to monitor hydration",
        "Scan barcodes for packaged foods",
        "Save frequently eaten meals for quick logging",
        "Set reminders to log meals consistently"
      ]
    },
    {
      number: 4,
      icon: <BarChart3 className="w-6 h-6" />,
      title: "View Your Analytics",
      description: "Access detailed analytics to understand your eating patterns, nutrition balance, and progress toward goals.",
      details: [
        "Navigate to the 'Analytics' page",
        "View daily, weekly, and monthly nutrition summaries",
        "Check macro and micronutrient breakdowns",
        "Monitor calorie intake vs. goals",
        "Track weight progress over time",
        "Identify eating patterns and trends"
      ]
    },
    {
      number: 5,
      icon: <Calendar className="w-6 h-6" />,
      title: "Plan Future Meals",
      description: "Use our meal planning feature to prepare healthy meals in advance and stay on track with your goals.",
      details: [
        "Go to 'Meal Planner' section",
        "Browse our recipe database",
        "Plan meals for the week ahead",
        "Generate shopping lists automatically",
        "Get AI-powered meal suggestions based on your goals",
        "Save and reuse successful meal plans"
      ]
    },
    {
      number: 6,
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Get Personalized Guidance",
      description: "Chat with our AI nutrition coach for personalized advice, recipe suggestions, and motivation.",
      details: [
        "Click the chat button in the bottom right",
        "Ask questions about nutrition and health",
        "Get recipe recommendations based on your preferences",
        "Receive meal suggestions for your goals",
        "Get tips for healthy eating habits",
        "Access 24/7 support and motivation"
      ]
    }
  ];

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
                NutriTracker
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/demo">
                <Button variant="outline" className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  View Demo
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            How to Use NutriTracker
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your complete guide to mastering nutrition tracking with AI-powered insights
          </p>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Step-by-Step Guide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to get the most out of your nutrition tracking journey
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <AnimatedCard
                key={step.number}
                className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg"
                animationDelay={index * 100}
                hoverEffect="lift"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                      <div className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our innovative features make nutrition tracking simple and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg"
                animationDelay={index * 100}
                hoverEffect="scale"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedCard className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Pro Tips for Success</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Maximize your results with these expert recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">📸 Food Photography Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Take photos in good lighting for better AI recognition</li>
                  <li>• Capture the entire plate to identify all food items</li>
                  <li>• Use different angles for complex dishes</li>
                  <li>• Separate items on the plate when possible</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">⏰ Consistency Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Log meals immediately after eating</li>
                  <li>• Set daily reminders to track water intake</li>
                  <li>• Review your analytics weekly</li>
                  <li>• Use the meal planner to stay prepared</li>
                </ul>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who have transformed their health with smart nutrition tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg animate-fade-in hover-scale">
                Get Started Free
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg animate-fade-in hover-scale" style={{ animationDelay: '100ms' }}>
                <Play className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-md text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-bold">NutriTracker</span>
          </div>
          <p className="text-gray-400">
            © 2024 NutriTracker. Revolutionizing nutrition tracking with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
