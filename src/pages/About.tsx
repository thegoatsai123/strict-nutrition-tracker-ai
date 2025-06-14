
import { ArrowLeft, Camera, BarChart3, Users, Brain, Shield, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
            
            <Link to="/">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            About NutriTracker
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed">
            Revolutionizing nutrition tracking through artificial intelligence and community support
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Our Mission</CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-3xl mx-auto">
                At NutriTracker, we believe that proper nutrition is the foundation of a healthy life. 
                Our mission is to make nutrition tracking effortless, accurate, and accessible to everyone 
                through cutting-edge AI technology and a supportive community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem We Solve</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Traditional nutrition tracking is time-consuming and often inaccurate. Manual food logging 
                    is tedious, and many people struggle to maintain consistent tracking habits. This leads to 
                    poor dietary choices and missed health goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Solution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    NutriTracker leverages advanced machine learning models to instantly recognize food from photos, 
                    automatically calculating nutritional information. Combined with comprehensive analytics and 
                    community support, we make healthy eating achievable for everyone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              <Card key={index} className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-md border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Our platform leverages cutting-edge technologies to deliver the best user experience
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Machine Learning</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Convolutional Neural Networks (CNN) for image recognition</li>
                  <li>• Food-101 dataset training for accurate food identification</li>
                  <li>• Continuous model improvement through user feedback</li>
                  <li>• Support for multiple ML providers and fallback systems</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• React & TypeScript for robust frontend development</li>
                  <li>• Supabase for secure backend and authentication</li>
                  <li>• Real-time data synchronization across devices</li>
                  <li>• Progressive Web App (PWA) capabilities</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Nutrition Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who have already revolutionized their approach to healthy eating
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Sign In
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
