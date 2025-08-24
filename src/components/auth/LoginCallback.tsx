import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Loader2 } from 'lucide-react';

export const LoginCallback: React.FC = () => {
  const { oktaAuth } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the callback from OKTA
        await oktaAuth.handleLoginRedirect();
        
        // Get the original URL the user was trying to access
        const originalUri = oktaAuth.getOriginalUri();
        
        // Navigate to the original URL or default to home
        navigate(originalUri || '/', { replace: true });
      } catch (error) {
        console.error('Login callback failed:', error);
        // Navigate to home page with error state
        navigate('/?error=login_failed', { replace: true });
      }
    };

    handleCallback();
  }, [oktaAuth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent-400 animate-spin" />
        <h2 className="text-xl font-semibold text-white">Completing Sign In...</h2>
        <p className="text-secondary-300 text-center max-w-md">
          Please wait while we securely log you into the Stargazer gaming platform.
        </p>
      </div>
    </div>
  );
};