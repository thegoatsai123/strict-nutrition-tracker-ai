
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, validateEmail, validatePassword, rateLimiter } from '@/utils/security';

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authAttempts, setAuthAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer any additional data fetching to prevent deadlocks
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            // Any additional user data loading can go here
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    // Rate limiting
    if (!rateLimiter.isAllowed(`signup_${email}`, 3, 300000)) { // 3 attempts per 5 minutes
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Rate limit exceeded') };
    }

    // Validation
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Invalid email') };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid password",
        description: passwordValidation.errors.join(', '),
        variant: "destructive",
      });
      return { data: null, error: new Error('Invalid password') };
    }

    try {
      setLoading(true);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name.trim()
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      return { data, error: null };
    } catch (error: any) {
      setAuthAttempts(prev => prev + 1);
      
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string) => {
    // Rate limiting
    if (!rateLimiter.isAllowed(`signin_${email}`, 5, 300000)) { // 5 attempts per 5 minutes
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Rate limit exceeded') };
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Invalid email') };
    }

    try {
      setLoading(true);
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });

      // Force page reload for clean state
      if (data.user) {
        window.location.href = '/';
      }

      return { data, error: null };
    } catch (error: any) {
      setAuthAttempts(prev => prev + 1);
      
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      
      toast({
        title: "Error signing in",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors during sign out
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });

      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    authAttempts,
  };
};
