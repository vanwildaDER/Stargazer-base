import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import type { UserClaims } from '@okta/okta-auth-js';

export interface StargazerUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  groups?: string[];
  roles?: string[];
  tenant?: string;
  permissions?: string[];
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: StargazerUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const [user, setUser] = useState<StargazerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformUserClaims = useCallback((claims: UserClaims): StargazerUser => {
    console.log('Raw OKTA claims received:', claims);
    
    // Handle minimal claims - some might be missing due to evaluation failure
    const userId = claims.sub || claims.uid || 'unknown-user';
    const userEmail = claims.email || claims.preferred_username || `${userId}@unknown.com`;
    const userName = claims.name || 
                     `${claims.given_name || ''} ${claims.family_name || ''}`.trim() || 
                     claims.preferred_username || 
                     userEmail;
    
    // Handle groups from different possible locations (might be empty due to claims failure)
    const groups = (claims.groups as string[]) || 
                   (claims['groups'] as string[]) || 
                   (claims['custom:groups'] as string[]) || 
                   [];
    
    const roles = groups.filter(group => group.startsWith('ROLE_')).map(role => role.replace('ROLE_', ''));
    const permissions = groups.filter(group => group.startsWith('PERM_')).map(perm => perm.replace('PERM_', ''));
    
    // For development - ALWAYS assign admin access to get past claims issues
    const developmentRoles = import.meta.env.DEV ? ['ADMIN'] : [];
    const developmentPermissions = import.meta.env.DEV ? 
      ['GLOPS', 'VPB', 'VPB_SCRIPTS', 'BANKING', 'SPORTS', 'GAMES', 'CUSTOMER_MARKETS', 'DATA_DELIVERY'] : [];
    
    const user = {
      id: userId,
      email: userEmail,
      name: userName,
      firstName: claims.given_name || 'Unknown',
      lastName: claims.family_name || 'User',
      groups,
      roles: [...roles, ...developmentRoles],
      tenant: claims.tenant as string || claims.preferred_username?.split('@')[1] || 'default',
      permissions: [...permissions, ...developmentPermissions],
    };
    
    console.log('Transformed user:', user);
    return user;
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      setError(null);
      if (authState?.isAuthenticated) {
        const userClaims = await oktaAuth.getUser();
        const transformedUser = transformUserClaims(userClaims);
        setUser(transformedUser);
        
        // Log successful authentication
        console.log('User authenticated:', {
          id: transformedUser.id,
          email: transformedUser.email,
          roles: transformedUser.roles,
          tenant: transformedUser.tenant,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Failed to fetch user information');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [authState?.isAuthenticated, oktaAuth, transformUserClaims]);

  useEffect(() => {
    if (authState?.isPending) {
      setIsLoading(true);
    } else {
      fetchUserInfo();
    }
  }, [authState, fetchUserInfo]);

  const login = useCallback(async () => {
    try {
      setError(null);
      await oktaAuth.signInWithRedirect({
        originalUri: window.location.pathname + window.location.search,
      });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    }
  }, [oktaAuth]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await oktaAuth.signOut({
        postLogoutRedirectUri: import.meta.env.VITE_OKTA_LOGOUT_REDIRECT_URI || window.location.origin,
      });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    }
  }, [oktaAuth]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user?.permissions && !user?.roles) return false;
    
    // Admin role has access to everything
    if (user?.roles?.includes('ADMIN')) return true;
    
    // VPB_Admin has access to all VPB permissions
    if (user?.roles?.includes('VPB_ADMIN') && permission.startsWith('VPB')) return true;
    
    // Check explicit permissions
    return user.permissions?.includes(permission) || false;
  }, [user?.permissions, user?.roles]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role);
  }, [user?.roles]);

  const contextValue: AuthContextValue = {
    isAuthenticated: authState?.isAuthenticated ?? false,
    isLoading: Boolean(isLoading) || Boolean(authState?.isPending),
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};