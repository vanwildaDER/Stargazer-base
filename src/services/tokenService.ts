import { CredentialDecryption } from '../utils/credentialDecryption';

export interface TokenCache {
  token: string;
  expiresAt: number;
  operator: string;
}

export type OperatorType = 'ITS' | 'Betway';

export class TokenService {
  private static tokenCache: Map<OperatorType, TokenCache> = new Map();
  private static readonly TOKEN_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  public static getVpbEndpoint(operator: OperatorType): string {
    const endpointMap = {
      'ITS': '/api/vpb/its',
      'Betway': '/api/vpb/betway'
    };
    return endpointMap[operator];
  }

  private static getTokenEndpoint(operator: OperatorType): string {
    const endpointMap = {
      'ITS': '/api/tokens/its',
      'Betway': '/api/tokens/betway'
    };
    return endpointMap[operator];
  }

  private static getApiKeyForOperator(operator: OperatorType): string {
    const keyMap = {
      'ITS': 'VITE_ITS_API_KEY',
      'Betway': 'VITE_BTW_API_KEY'
    };

    const apiKeyValue = import.meta.env[keyMap[operator]];
    if (!apiKeyValue) {
      throw new Error(`API key not found for operator: ${operator}. Please ensure ${keyMap[operator]} is set in your environment variables.`);
    }

    // For now, we'll assume the API keys are stored as plain text in development
    // In production, you would implement server-side decryption
    if (CredentialDecryption.isEncrypted(apiKeyValue)) {
      throw new Error(`Encrypted credentials detected for ${operator}. Please implement server-side decryption or use plain text API keys for development.`);
    }

    return apiKeyValue;
  }

  private static isTokenExpired(cache: TokenCache): boolean {
    return Date.now() >= cache.expiresAt;
  }

  public static getCachedToken(operator: OperatorType): string | null {
    const cache = this.tokenCache.get(operator);
    if (!cache || this.isTokenExpired(cache)) {
      return null;
    }
    return cache.token;
  }

  public static async fetchToken(operator: OperatorType): Promise<string> {
    try {
      const apiKey = this.getApiKeyForOperator(operator);
      const tokenEndpoint = this.getTokenEndpoint(operator);
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          APIKey: apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token: HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      // Log the response for debugging
      console.log('Token API Response:', data);
      
      // Handle different possible response formats
      let token: string;
      if (data.AccessToken) {
        token = data.AccessToken;
      } else if (data.token) {
        token = data.token;
      } else if (data.Token) {
        token = data.Token;
      } else if (typeof data === 'string') {
        token = data;
      } else {
        console.error('Unexpected token response format:', data);
        throw new Error(`Invalid token response format. Expected AccessToken field but received: ${JSON.stringify(data)}`);
      }

      // Cache the token with expiry
      const expiresAt = Date.now() + this.TOKEN_CACHE_DURATION;
      this.tokenCache.set(operator, {
        token: token,
        expiresAt,
        operator
      });

      return token;
    } catch (error) {
      console.error(`Error fetching token for ${operator}:`, error);
      throw error;
    }
  }

  public static async getToken(operator: OperatorType): Promise<string> {
    // Try to get cached token first
    const cachedToken = this.getCachedToken(operator);
    if (cachedToken) {
      return cachedToken;
    }

    // Fetch new token if no valid cached token
    return await this.fetchToken(operator);
  }

  public static clearCache(operator?: OperatorType): void {
    if (operator) {
      this.tokenCache.delete(operator);
    } else {
      this.tokenCache.clear();
    }
  }

  public static getTokenStatus(operator: OperatorType): { hasToken: boolean; isExpired: boolean; expiresIn?: number } {
    const cache = this.tokenCache.get(operator);
    if (!cache) {
      return { hasToken: false, isExpired: true };
    }

    const isExpired = this.isTokenExpired(cache);
    const expiresIn = isExpired ? 0 : Math.max(0, cache.expiresAt - Date.now());

    return {
      hasToken: true,
      isExpired,
      expiresIn
    };
  }
}