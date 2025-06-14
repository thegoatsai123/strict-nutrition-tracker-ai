
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { Header } from "@/components/Layout/Header";
import Index from "./pages/Index";
import LogFood from "./pages/LogFood";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import MealPlanner from "./pages/MealPlanner";
import ShoppingList from "./pages/ShoppingList";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Landing from "./pages/Landing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected routes */}
          <Route path="/home" element={
            <AuthGuard>
              <Header />
              <Index />
            </AuthGuard>
          } />
          <Route path="/log-food" element={
            <AuthGuard>
              <Header />
              <LogFood />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Header />
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/recipes" element={
            <AuthGuard>
              <Header />
              <Recipes />
            </AuthGuard>
          } />
          <Route path="/community" element={
            <AuthGuard>
              <Header />
              <Community />
            </AuthGuard>
          } />
          <Route path="/meal-planner" element={
            <AuthGuard>
              <Header />
              <MealPlanner />
            </AuthGuard>
          } />
          <Route path="/shopping-list" element={
            <AuthGuard>
              <Header />
              <ShoppingList />
            </AuthGuard>
          } />
          <Route path="/achievements" element={
            <AuthGuard>
              <Header />
              <Achievements />
            </AuthGuard>
          } />
          <Route path="/settings" element={
            <AuthGuard>
              <Header />
              <Settings />
            </AuthGuard>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
