import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission, 
  requiredRole,
  fallback 
}) => {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole, login } = useAuth();

  // Show loading spinner while authentication is in progress
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-accent-400 animate-spin" />
          <p className="text-secondary-300 text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800">
        <div className="bg-secondary-800 border border-secondary-600 rounded-xl p-8 max-w-md mx-4 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Stargazer</h1>
            <p className="text-secondary-300">Gaming Platform Management Portal</p>
          </div>
          
          <div className="mb-6">
            <p className="text-secondary-200 mb-4">
              Please sign in to access the gaming platform administration tools.
            </p>
          </div>
          
          <button
            onClick={login}
            className="w-full bg-accent-600 hover:bg-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-secondary-800"
          >
            Sign In with OKTA
          </button>
        </div>
      </div>
    );
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 max-w-md mx-4 text-center">
          <h2 className="text-xl font-semibold text-red-300 mb-4">Access Denied</h2>
          <p className="text-red-200">
            You don't have the required permission: <code className="bg-red-800 px-2 py-1 rounded text-red-100">{requiredPermission}</code>
          </p>
          <div className="mt-4 text-sm text-red-300">
            Current user: {user?.email}
          </div>
        </div>
      </div>
    );
  }

  // Check for required role
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 max-w-md mx-4 text-center">
          <h2 className="text-xl font-semibold text-red-300 mb-4">Access Denied</h2>
          <p className="text-red-200">
            You don't have the required role: <code className="bg-red-800 px-2 py-1 rounded text-red-100">{requiredRole}</code>
          </p>
          <div className="mt-4 text-sm text-red-300">
            Current user: {user?.email}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};