
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Loader2, Shield } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading, authAttempts } = useSecureAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign in if not authenticated
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Verifying authentication...</p>
          {authAttempts > 2 && (
            <p className="text-sm text-amber-600 mt-2">
              Taking longer than usual...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};
