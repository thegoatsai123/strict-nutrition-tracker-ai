
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/Layout/Header';
import { LoadingSpinner, SkeletonCard } from '@/components/ui/loading-states';

// Lazy load pages for better performance
const Landing = lazy(() => import('@/pages/Landing'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const Index = lazy(() => import('@/pages/Index'));
const LogFood = lazy(() => import('@/pages/LogFood'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const MealPlanner = lazy(() => import('@/pages/MealPlanner'));
const Community = lazy(() => import('@/pages/Community'));
const Recipes = lazy(() => import('@/pages/Recipes'));
const About = lazy(() => import('@/pages/About'));
const Demo = lazy(() => import('@/pages/Demo'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

const PageLoader = () => (
  <div className="container mx-auto p-6">
    <div className="flex items-center justify-center mb-6">
      <LoadingSpinner size="lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard showAvatar lines={4} />
      <SkeletonCard lines={3} />
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <Suspense fallback={<PageLoader />}>
                  <Landing />
                </Suspense>
              } />
              <Route path="/signin" element={
                <Suspense fallback={<PageLoader />}>
                  <SignIn />
                </Suspense>
              } />
              <Route path="/sign-in" element={<Navigate to="/signin" replace />} />
              <Route path="/signup" element={
                <Suspense fallback={<PageLoader />}>
                  <SignUp />
                </Suspense>
              } />
              <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
              <Route path="/about" element={
                <Suspense fallback={<PageLoader />}>
                  <About />
                </Suspense>
              } />
              <Route path="/demo" element={
                <Suspense fallback={<PageLoader />}>
                  <Demo />
                </Suspense>
              } />

              {/* Protected routes */}
              <Route path="/home" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Index />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/dashboard" element={<Navigate to="/home" replace />} />
              <Route path="/log-food" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <LogFood />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/analytics" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Analytics />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/settings" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Settings />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/meal-planner" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <MealPlanner />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/community" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Community />
                  </Suspense>
                </AuthGuard>
              } />
              <Route path="/recipes" element={
                <AuthGuard>
                  <Header />
                  <Suspense fallback={<PageLoader />}>
                    <Recipes />
                  </Suspense>
                </AuthGuard>
              } />

              {/* 404 handler */}
              <Route path="*" element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
