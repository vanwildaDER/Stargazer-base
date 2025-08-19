/**
 * Encryption utilities for secure credential storage
 * Uses Web Crypto API for browser-compatible encryption
 */

export interface EncryptedValue {
  encrypted: string;
  iv: string;
  salt: string;
  algorithm: string;
}

export class CredentialEncryption {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12; // 96 bits for GCM
  private static readonly SALT_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  /**
   * Derives encryption key from master password using PBKDF2
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // High iteration count for security
        hash: 'SHA-256',
      },
      keyMaterial,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH,
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypts a credential value using AES-GCM
   */
  static async encrypt(value: string, masterPassword: string): Promise<EncryptedValue> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(value);
      
      // Generate random salt and IV
      const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      // Derive key from password
      const key = await this.deriveKey(masterPassword, salt);
      
      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv,
        },
        key,
        data
      );

      return {
        encrypted: this.arrayBufferToBase64(encrypted),
        iv: this.arrayBufferToBase64(iv),
        salt: this.arrayBufferToBase64(salt),
        algorithm: this.ALGORITHM,
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt credential');
    }
  }

  /**
   * Decrypts an encrypted credential value
   */
  static async decrypt(encryptedValue: EncryptedValue, masterPassword: string): Promise<string> {
    try {
      const salt = this.base64ToArrayBuffer(encryptedValue.salt);
      const iv = this.base64ToArrayBuffer(encryptedValue.iv);
      const encrypted = this.base64ToArrayBuffer(encryptedValue.encrypted);
      
      // Derive the same key
      const key = await this.deriveKey(masterPassword, new Uint8Array(salt));
      
      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: new Uint8Array(iv),
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt credential - invalid password or corrupted data');
    }
  }

  /**
   * Validates if a string is an encrypted value
   */
  static isEncrypted(value: string): boolean {
    try {
      const parsed = JSON.parse(value);
      return (
        typeof parsed === 'object' &&
        typeof parsed.encrypted === 'string' &&
        typeof parsed.iv === 'string' &&
        typeof parsed.salt === 'string' &&
        typeof parsed.algorithm === 'string'
      );
    } catch {
      return false;
    }
  }

  /**
   * Gets master password from various sources with fallbacks
   */
  static getMasterPassword(): string {
    // 1. Check environment variable
    const envPassword = import.meta.env.VITE_CREDENTIAL_MASTER_PASSWORD;
    if (envPassword) {
      return envPassword;
    }

    // 2. Check for deployment-specific password
    const deploymentPassword = import.meta.env.VITE_DEPLOYMENT_KEY;
    if (deploymentPassword) {
      return deploymentPassword;
    }

    // 3. Development fallback (should be overridden in production)
    if (import.meta.env.DEV) {
      console.warn('Using development master password. Set VITE_CREDENTIAL_MASTER_PASSWORD in production.');
      return 'stargazer-dev-key-2024';
    }

    throw new Error('Master password not configured. Set VITE_CREDENTIAL_MASTER_PASSWORD environment variable.');
  }

  /**
   * Helper function to convert ArrayBuffer to Base64
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper function to convert Base64 to ArrayBuffer
   */
  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Convenience class for managing encrypted gaming credentials
 */
export class GameCredentialManager {
  private static cache = new Map<string, string>();

  /**
   * Retrieves and decrypts a credential value
   */
  static async getCredential(key: string): Promise<string> {
    const cacheKey = `decrypted_${key}`;
    
    // Check cache first (security vs performance trade-off)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const encryptedValue = import.meta.env[key];
    if (!encryptedValue) {
      throw new Error(`Credential ${key} not found in environment variables`);
    }

    // If it's not encrypted, return as-is (backwards compatibility)
    if (!CredentialEncryption.isEncrypted(encryptedValue)) {
      console.warn(`Credential ${key} is stored in plain text. Consider encrypting it.`);
      return encryptedValue;
    }

    try {
      const masterPassword = CredentialEncryption.getMasterPassword();
      const encrypted: EncryptedValue = JSON.parse(encryptedValue);
      const decrypted = await CredentialEncryption.decrypt(encrypted, masterPassword);
      
      // Cache for performance (with time-based expiry)
      this.cache.set(cacheKey, decrypted);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000); // 5 min cache
      
      return decrypted;
    } catch (error) {
      console.error(`Failed to decrypt credential ${key}:`, error);
      throw new Error(`Unable to access credential ${key}`);
    }
  }

  /**
   * Clears the credential cache (for security)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics for debugging
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Development utilities
if (import.meta.env.DEV) {
  (window as any).stargazerEncryption = {
    encrypt: CredentialEncryption.encrypt,
    decrypt: CredentialEncryption.decrypt,
    isEncrypted: CredentialEncryption.isEncrypted,
    manager: GameCredentialManager,
  };
}