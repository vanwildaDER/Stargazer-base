import { env } from '../config/env';
import { GameCredentialManager } from '../utils/encryption';

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private tokenCache: Map<string, { token: AuthToken; expiresAt: number }> = new Map();
  
  constructor() {
    this.baseUrl = env.API_BASE_URL;
  }

  private async getTokenFromCredentials(clientId: string, clientSecret: string, scope?: string): Promise<AuthToken> {
    const cacheKey = `${clientId}_${scope || 'default'}`;
    const cached = this.tokenCache.get(cacheKey);
    
    if (cached && cached.expiresAt > Date.now() + 60000) { // 1 minute buffer
      return cached.token;
    }

    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: scope || 'default'
        }),
      });

      if (!response.ok) {
        throw new ApiError({
          message: `Token request failed: ${response.statusText}`,
          code: 'TOKEN_REQUEST_FAILED',
          status: response.status
        });
      }

      const token: AuthToken = await response.json();
      const expiresAt = Date.now() + ((token.expires_in || 3600) * 1000);
      
      this.tokenCache.set(cacheKey, { token, expiresAt });
      
      return token;
    } catch (error) {
      console.error('Token acquisition failed:', error);
      throw error;
    }
  }

  async makeVPBRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token: AuthToken;
    
    try {
      const apiKey = await GameCredentialManager.getCredential('VITE_VPB_API_KEY');
      const apiSecret = await GameCredentialManager.getCredential('VITE_VPB_API_SECRET');

      if (!apiKey || !apiSecret) {
        throw new Error('VPB API credentials not configured. Please check your environment variables.');
      }

      token = await this.getTokenFromCredentials(apiKey, apiSecret, 'vpb');
    } catch (error) {
      console.error('Failed to retrieve VPB credentials:', error);
      throw new Error('Unable to authenticate with VPB API');
    }

    const response = await fetch(`/api/vpb${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `${token.token_type} ${token.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError({
        message: `VPB API request failed: ${errorText}`,
        code: 'VPB_API_ERROR',
        status: response.status
      });
    }

    return response.json();
  }

  async makeGamingAPIRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token: AuthToken;
    
    try {
      const clientId = await GameCredentialManager.getCredential('VITE_GAMING_API_CLIENT_ID');
      const clientSecret = await GameCredentialManager.getCredential('VITE_GAMING_API_CLIENT_SECRET');

      if (!clientId || !clientSecret) {
        throw new Error('Gaming API credentials not configured. Please check your environment variables.');
      }

      token = await this.getTokenFromCredentials(clientId, clientSecret, 'gaming');
    } catch (error) {
      console.error('Failed to retrieve Gaming API credentials:', error);
      throw new Error('Unable to authenticate with Gaming API');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `${token.token_type} ${token.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tenant-ID': env.DEFAULT_TENANT_ID,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError({
        message: `Gaming API request failed: ${errorText}`,
        code: 'GAMING_API_ERROR',
        status: response.status
      });
    }

    return response.json();
  }

  clearTokenCache(): void {
    this.tokenCache.clear();
  }

  getTokenCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.tokenCache.size,
      keys: Array.from(this.tokenCache.keys())
    };
  }
}

// Singleton instance for the application
export const apiClient = new ApiClient();

// VPB specific API methods
export const vpbAPI = {
  async getAllJourneys() {
    return apiClient.makeVPBRequest('/journeys');
  },

  async getSingleJourneyDefinition(journeyId: string) {
    return apiClient.makeVPBRequest(`/journeys/${journeyId}/definition`);
  },

  async getPlayerMetrics(playerId: string) {
    return apiClient.makeVPBRequest(`/players/${playerId}/metrics`);
  },

  async getBetsPerMinute(timeframe: string = '1h') {
    return apiClient.makeVPBRequest(`/metrics/bets-per-minute?timeframe=${timeframe}`);
  }
};

// Gaming platform API methods
export const gamingAPI = {
  async getSystemStatus() {
    return apiClient.makeGamingAPIRequest('/system/status');
  },

  async getActiveUsers() {
    return apiClient.makeGamingAPIRequest('/metrics/users/active');
  },

  async getRevenue(period: string = '24h') {
    return apiClient.makeGamingAPIRequest(`/metrics/revenue?period=${period}`);
  },

  async getAlerts() {
    return apiClient.makeGamingAPIRequest('/alerts');
  }
};

// Development utilities
if (env.APP_ENVIRONMENT === 'development') {
  // Expose API client to window for debugging
  (window as any).stargazerAPI = {
    client: apiClient,
    vpb: vpbAPI,
    gaming: gamingAPI,
    clearCache: () => apiClient.clearTokenCache(),
    cacheStats: () => apiClient.getTokenCacheStats()
  };
}