// Environment configuration with proper validation and defaults
interface EnvironmentConfig {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  
  // API
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_VERSION: string;
  
  // WebSocket
  WS_URL: string;
  WS_RECONNECT_INTERVAL: number;
  WS_MAX_RECONNECT_ATTEMPTS: number;
  
  // Authentication
  AUTH_TOKEN_STORAGE_KEY: string;
  AUTH_REFRESH_TOKEN_STORAGE_KEY: string;
  AUTH_TOKEN_EXPIRY_THRESHOLD: number;
  
  // Monitoring & Logging
  ENABLE_ERROR_TRACKING: boolean;
  SENTRY_DSN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  
  // Feature Flags
  ENABLE_DEV_TOOLS: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  ENABLE_ANALYTICS: boolean;
  
  // Tenant
  DEFAULT_TENANT_ID: string;
  MULTI_TENANT_MODE: boolean;
  
  // Security
  ENABLE_CSP: boolean;
  SESSION_TIMEOUT: number;
  REQUIRE_HTTPS: boolean;
  
  // Gaming Platform Specific
  REFRESH_INTERVAL_METRICS: number;
  REFRESH_INTERVAL_ALERTS: number;
  MAX_ALERT_RETENTION_HOURS: number;
  
  // API Keys & Credentials (for server-side proxy use only)
  VPB_API_KEY: string;
  VPB_API_SECRET: string;
  GAMING_API_CLIENT_ID: string;
  GAMING_API_CLIENT_SECRET: string;
  
  // Encryption Configuration
  CREDENTIAL_MASTER_PASSWORD: string;
  DEPLOYMENT_KEY: string;
  ENABLE_CREDENTIAL_ENCRYPTION: boolean;
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getEnvVarAsNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? Number(value) : defaultValue;
};

const getEnvVarAsBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  return value ? value.toLowerCase() === 'true' : defaultValue;
};

// Validate environment is one of expected values
const validateEnvironment = (envValue: string): 'development' | 'staging' | 'production' => {
  const validEnvs = ['development', 'staging', 'production'];
  if (validEnvs.includes(envValue)) {
    return envValue as 'development' | 'staging' | 'production';
  }
  console.warn(`Invalid environment "${envValue}", defaulting to development`);
  return 'development';
};

const validateLogLevel = (level: string): 'debug' | 'info' | 'warn' | 'error' => {
  const validLevels = ['debug', 'info', 'warn', 'error'];
  if (validLevels.includes(level)) {
    return level as 'debug' | 'info' | 'warn' | 'error';
  }
  console.warn(`Invalid log level "${level}", defaulting to warn`);
  return 'warn';
};

// Main environment configuration
export const env: EnvironmentConfig = {
  // Application
  APP_NAME: getEnvVar('VITE_APP_NAME', 'Stargazer'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  APP_ENVIRONMENT: validateEnvironment(getEnvVar('VITE_APP_ENVIRONMENT', 'development')),
  
  // API
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080/api'),
  API_TIMEOUT: getEnvVarAsNumber('VITE_API_TIMEOUT', 10000),
  API_VERSION: getEnvVar('VITE_API_VERSION', 'v1'),
  
  // WebSocket
  WS_URL: getEnvVar('VITE_WS_URL', 'ws://localhost:8080'),
  WS_RECONNECT_INTERVAL: getEnvVarAsNumber('VITE_WS_RECONNECT_INTERVAL', 5000),
  WS_MAX_RECONNECT_ATTEMPTS: getEnvVarAsNumber('VITE_WS_MAX_RECONNECT_ATTEMPTS', 10),
  
  // Authentication
  AUTH_TOKEN_STORAGE_KEY: getEnvVar('VITE_AUTH_TOKEN_STORAGE_KEY', 'stargazer_token'),
  AUTH_REFRESH_TOKEN_STORAGE_KEY: getEnvVar('VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY', 'stargazer_refresh_token'),
  AUTH_TOKEN_EXPIRY_THRESHOLD: getEnvVarAsNumber('VITE_AUTH_TOKEN_EXPIRY_THRESHOLD', 300000),
  
  // Monitoring & Logging
  ENABLE_ERROR_TRACKING: getEnvVarAsBoolean('VITE_ENABLE_ERROR_TRACKING', true),
  SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN', ''),
  LOG_LEVEL: validateLogLevel(getEnvVar('VITE_LOG_LEVEL', 'warn')),
  
  // Feature Flags
  ENABLE_DEV_TOOLS: getEnvVarAsBoolean('VITE_ENABLE_DEV_TOOLS', import.meta.env.DEV),
  ENABLE_PERFORMANCE_MONITORING: getEnvVarAsBoolean('VITE_ENABLE_PERFORMANCE_MONITORING', false),
  ENABLE_ANALYTICS: getEnvVarAsBoolean('VITE_ENABLE_ANALYTICS', false),
  
  // Tenant
  DEFAULT_TENANT_ID: getEnvVar('VITE_DEFAULT_TENANT_ID', ''),
  MULTI_TENANT_MODE: getEnvVarAsBoolean('VITE_MULTI_TENANT_MODE', true),
  
  // Security
  ENABLE_CSP: getEnvVarAsBoolean('VITE_ENABLE_CSP', true),
  SESSION_TIMEOUT: getEnvVarAsNumber('VITE_SESSION_TIMEOUT', 3600000), // 1 hour
  REQUIRE_HTTPS: getEnvVarAsBoolean('VITE_REQUIRE_HTTPS', false),
  
  // Gaming Platform Specific
  REFRESH_INTERVAL_METRICS: getEnvVarAsNumber('VITE_REFRESH_INTERVAL_METRICS', 5000),
  REFRESH_INTERVAL_ALERTS: getEnvVarAsNumber('VITE_REFRESH_INTERVAL_ALERTS', 10000),
  MAX_ALERT_RETENTION_HOURS: getEnvVarAsNumber('VITE_MAX_ALERT_RETENTION_HOURS', 24),
  
  // API Keys & Credentials (for server-side proxy use only)
  VPB_API_KEY: getEnvVar('VITE_VPB_API_KEY', ''),
  VPB_API_SECRET: getEnvVar('VITE_VPB_API_SECRET', ''),
  GAMING_API_CLIENT_ID: getEnvVar('VITE_GAMING_API_CLIENT_ID', ''),
  GAMING_API_CLIENT_SECRET: getEnvVar('VITE_GAMING_API_CLIENT_SECRET', ''),
  
  // Encryption Configuration
  CREDENTIAL_MASTER_PASSWORD: getEnvVar('VITE_CREDENTIAL_MASTER_PASSWORD', ''),
  DEPLOYMENT_KEY: getEnvVar('VITE_DEPLOYMENT_KEY', ''),
  ENABLE_CREDENTIAL_ENCRYPTION: getEnvVarAsBoolean('VITE_ENABLE_CREDENTIAL_ENCRYPTION', true),
};

// Validation functions
export const validateEnvironmentConfig = (): string[] => {
  const errors: string[] = [];
  
  if (!env.API_BASE_URL) {
    errors.push('API_BASE_URL is required');
  }
  
  if (env.API_TIMEOUT < 1000) {
    errors.push('API_TIMEOUT must be at least 1000ms');
  }
  
  if (env.WS_RECONNECT_INTERVAL < 1000) {
    errors.push('WS_RECONNECT_INTERVAL must be at least 1000ms');
  }
  
  if (env.APP_ENVIRONMENT === 'production') {
    if (!env.REQUIRE_HTTPS) {
      console.warn('HTTPS should be required in production');
    }
    
    if (env.ENABLE_DEV_TOOLS) {
      errors.push('Dev tools should be disabled in production');
    }
    
    // Security validation for production
    if (!env.VPB_API_KEY || !env.VPB_API_SECRET) {
      errors.push('VPB API credentials are required in production');
    }
    
    if (!env.GAMING_API_CLIENT_ID || !env.GAMING_API_CLIENT_SECRET) {
      errors.push('Gaming API credentials are required in production');
    }
    
    // Encryption validation for production
    if (env.ENABLE_CREDENTIAL_ENCRYPTION && !env.CREDENTIAL_MASTER_PASSWORD && !env.DEPLOYMENT_KEY) {
      errors.push('Master password or deployment key required when credential encryption is enabled');
    }
  }
  
  return errors;
};

// Initialize and validate configuration
const configErrors = validateEnvironmentConfig();
if (configErrors.length > 0) {
  console.error('Environment configuration errors:', configErrors);
  if (env.APP_ENVIRONMENT === 'production') {
    throw new Error(`Invalid production configuration: ${configErrors.join(', ')}`);
  }
}

// Development logging
if (env.APP_ENVIRONMENT === 'development') {
  console.info('Environment configuration loaded:', {
    environment: env.APP_ENVIRONMENT,
    apiUrl: env.API_BASE_URL,
    wsUrl: env.WS_URL,
    features: {
      devTools: env.ENABLE_DEV_TOOLS,
      errorTracking: env.ENABLE_ERROR_TRACKING,
      multiTenant: env.MULTI_TENANT_MODE,
    }
  });
}