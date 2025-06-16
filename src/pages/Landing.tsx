
import { Link } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingElement, ParticleBackground } from '@/components/ui/floating-elements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, LogIn, UserPlus, Camera, BarChart3, Users, Sparkles, Info, CheckCircle, Zap, Heart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleBackground count={60} />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <FloatingElement delay={0}>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                  <span className="text-white font-bold text-sm sm:text-lg">N</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  NutriTracker
                </span>
              </div>
            </FloatingElement>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <FloatingElement delay={0.1}>
                <Link to="/about">
                  <AnimatedButton variant="ghost" size="sm" className="flex items-center text-xs sm:text-sm">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">About</span>
                  </AnimatedButton>
                </Link>
              </FloatingElement>
              
              <FloatingElement delay={0.2}>
                <Link to="/signin">
                  <AnimatedButton variant="outline" size="sm" className="flex items-center text-xs sm:text-sm">
                    <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Sign In
                  </AnimatedButton>
                </Link>
              </FloatingElement>
              
              <FloatingElement delay={0.4}>
                <Link to="/signup">
                  <AnimatedButton variant="gradient" size="sm" className="flex items-center text-xs sm:text-sm">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Sign Up
                  </AnimatedButton>
                </Link>
              </FloatingElement>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <FloatingElement delay={0.6}>
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6 sm:mb-8 border border-green-200">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-2" />
              <span className="text-xs sm:text-sm font-semibold text-green-700">AI-Powered Nutrition Tracking</span>
            </div>
          </FloatingElement>
          
          <FloatingElement delay={0.8}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Smart Nutrition
              <br />
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl">Tracking Revolution</span>
            </h1>
          </FloatingElement>
          
          <FloatingElement delay={1.0}>
            <p className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-4xl mx-auto text-gray-700 leading-relaxed px-4">
              Experience the future of nutrition tracking with AI-powered food recognition, 
              comprehensive analytics, and personalized recommendations. Transform your health journey today.
            </p>
          </FloatingElement>
          
          <FloatingElement delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <AnimatedButton size="lg" variant="gradient" animation="bounce" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Tracking with AI
                </AnimatedButton>
              </Link>
              <Link to="/demo" className="w-full sm:w-auto">
                <AnimatedButton variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Demo
                </AnimatedButton>
              </Link>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FloatingElement delay={1.4}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Revolutionary Features
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience cutting-edge technology that makes nutrition tracking effortless and accurate
              </p>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />,
                title: "AI Food Recognition",
                description: "Advanced CNN model trained on Food-101 dataset for instant food identification from photos",
                delay: 1.6
              },
              {
                icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />,
                title: "Smart Analytics",
                description: "Real-time nutrition analysis with personalized insights and goal tracking",
                delay: 1.8
              },
              {
                icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />,
                title: "Community Platform",
                description: "Connect with health enthusiasts and share your nutrition journey",
                delay: 2.0
              }
            ].map((feature, index) => (
              <FloatingElement key={index} delay={feature.delay}>
                <GlassCard className="p-6 sm:p-8 h-full group hover:shadow-xl transition-all duration-300">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </GlassCard>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <FloatingElement delay={2.2}>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Choose NutriTracker?
              </h2>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />,
                title: "Lightning Fast",
                description: "Get nutrition data instantly with our AI-powered recognition"
              },
              {
                icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />,
                title: "Highly Accurate",
                description: "99.2% accuracy rate in food identification and nutrition calculation"
              },
              {
                icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />,
                title: "Made with Love",
                description: "Designed by nutrition experts and loved by thousands of users"
              },
              {
                icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
                title: "Detailed Analytics",
                description: "Comprehensive insights into your nutrition patterns and progress"
              },
              {
                icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />,
                title: "Community Support",
                description: "Join a community of health-conscious individuals on the same journey"
              },
              {
                icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />,
                title: "Always Improving",
                description: "Regular updates with new features based on user feedback"
              }
            ].map((benefit, index) => (
              <FloatingElement key={index} delay={2.4 + index * 0.1}>
                <Card className="p-4 sm:p-6 h-full hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/40">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 p-2 bg-white/80 rounded-lg shadow-sm">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <FloatingElement delay={3.0}>
          <GlassCard className="max-w-4xl mx-auto p-8 sm:p-12 text-center" gradient>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Ready to Transform Your Health?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have revolutionized their nutrition tracking with our AI-powered platform.
            </p>
            <Link to="/signup">
              <AnimatedButton size="lg" variant="gradient" animation="pulse" className="text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Your Journey Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </AnimatedButton>
            </Link>
          </GlassCard>
        </FloatingElement>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 backdrop-blur-md text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <FloatingElement delay={3.2}>
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-white font-bold text-sm sm:text-lg">N</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold">NutriTracker</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              © 2024 NutriTracker. Revolutionizing nutrition tracking with AI.
            </p>
          </FloatingElement>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
