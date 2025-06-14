
import { Link } from 'react-router-dom';
import { AnimatedButton } from '@/components/ui/animated-button';
import { GlassCard } from '@/components/ui/glass-card';
import { FloatingElement, ParticleBackground } from '@/components/ui/floating-elements';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, LogIn, UserPlus, Camera, BarChart3, Users, Sparkles, Info } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <ParticleBackground count={60} />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <FloatingElement delay={0}>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  NutriTracker
                </span>
              </div>
            </FloatingElement>
            
            <div className="flex items-center space-x-4">
              <FloatingElement delay={0.1}>
                <Link to="/about">
                  <AnimatedButton variant="ghost" className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </AnimatedButton>
                </Link>
              </FloatingElement>
              
              <FloatingElement delay={0.2}>
                <Link to="/signin">
                  <AnimatedButton variant="outline" className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </AnimatedButton>
                </Link>
              </FloatingElement>
              
              <FloatingElement delay={0.4}>
                <Link to="/signup">
                  <AnimatedButton variant="gradient" className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </AnimatedButton>
                </Link>
              </FloatingElement>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <FloatingElement delay={0.6}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-8 border border-green-200">
              <Sparkles className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-700">AI-Powered Nutrition Tracking</span>
            </div>
          </FloatingElement>
          
          <FloatingElement delay={0.8}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Smart Nutrition
              <br />
              <span className="text-4xl md:text-6xl">Tracking Revolution</span>
            </h1>
          </FloatingElement>
          
          <FloatingElement delay={1.0}>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-700 leading-relaxed">
              Experience the future of nutrition tracking with AI-powered food recognition, 
              comprehensive analytics, and personalized recommendations. Transform your health journey today.
            </p>
          </FloatingElement>
          
          <FloatingElement delay={1.2}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup">
                <AnimatedButton size="lg" variant="gradient" animation="bounce" className="text-lg px-8 py-4">
                  <Camera className="w-5 h-5 mr-2" />
                  Start Tracking with AI
                </AnimatedButton>
              </Link>
              <Link to="/signin">
                <AnimatedButton variant="outline" size="lg" className="text-lg px-8 py-4">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Demo
                </AnimatedButton>
              </Link>
            </div>
          </FloatingElement>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FloatingElement delay={1.4}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Revolutionary Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience cutting-edge technology that makes nutrition tracking effortless and accurate
              </p>
            </div>
          </FloatingElement>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8 text-green-500" />,
                title: "AI Food Recognition",
                description: "Advanced CNN model trained on Food-101 dataset for instant food identification from photos",
                delay: 1.6
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
                title: "Smart Analytics",
                description: "Real-time nutrition analysis with personalized insights and goal tracking",
                delay: 1.8
              },
              {
                icon: <Users className="w-8 h-8 text-purple-500" />,
                title: "Community Platform",
                description: "Connect with health enthusiasts and share your nutrition journey",
                delay: 2.0
              }
            ].map((feature, index) => (
              <FloatingElement key={index} delay={feature.delay}>
                <GlassCard className="p-8 h-full group">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </GlassCard>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <FloatingElement delay={2.2}>
          <GlassCard className="max-w-4xl mx-auto p-12 text-center" gradient>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
              Join thousands of users who have revolutionized their nutrition tracking with our AI-powered platform.
            </p>
            <Link to="/signup">
              <AnimatedButton size="lg" variant="gradient" animation="pulse" className="text-lg px-10 py-4">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey Now
              </AnimatedButton>
            </Link>
          </GlassCard>
        </FloatingElement>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/90 backdrop-blur-md text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <FloatingElement delay={2.4}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold">NutriTracker</span>
            </div>
            <p className="text-gray-400">
              © 2024 NutriTracker. Revolutionizing nutrition tracking with AI.
            </p>
          </FloatingElement>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
