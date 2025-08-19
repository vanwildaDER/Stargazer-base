/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: string;
  
  // API
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_VERSION: string;
  
  // WebSocket
  readonly VITE_WS_URL: string;
  readonly VITE_WS_RECONNECT_INTERVAL: string;
  readonly VITE_WS_MAX_RECONNECT_ATTEMPTS: string;
  
  // Authentication
  readonly VITE_AUTH_TOKEN_STORAGE_KEY: string;
  readonly VITE_AUTH_REFRESH_TOKEN_STORAGE_KEY: string;
  readonly VITE_AUTH_TOKEN_EXPIRY_THRESHOLD: string;
  
  // Monitoring & Logging
  readonly VITE_ENABLE_ERROR_TRACKING: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_LOG_LEVEL: string;
  
  // Feature Flags
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  
  // Tenant
  readonly VITE_DEFAULT_TENANT_ID: string;
  readonly VITE_MULTI_TENANT_MODE: string;
  
  // Security
  readonly VITE_ENABLE_CSP: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_REQUIRE_HTTPS: string;
  
  // Gaming Platform Specific
  readonly VITE_REFRESH_INTERVAL_METRICS: string;
  readonly VITE_REFRESH_INTERVAL_ALERTS: string;
  readonly VITE_MAX_ALERT_RETENTION_HOURS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}