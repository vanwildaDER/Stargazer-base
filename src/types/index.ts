// ===== NAVIGATION TYPES =====
export interface MenuItem {
  id: string;
  name: string;
  icon?: string;
  subItems: SubMenuItem[];
  permissions?: UserPermission[];
}

export interface SubMenuItem {
  id: string;
  name: string;
  route: string;
  permissions?: UserPermission[];
  tertiaryItems?: TertiaryMenuItem[];
}

export interface TertiaryMenuItem {
  id: string;
  name: string;
  route: string;
  permissions?: UserPermission[];
}

// ===== APPLICATION STATE =====
export interface AppState {
  isDarkMode: boolean;
  activeMainItem: string | null;
  activeSubItem: string | null;
  activeTertiaryItem: string | null;
  user: User | null;
  tenant: Tenant | null;
}

// ===== USER & AUTHENTICATION =====
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  permissions: UserPermission[];
  tenants: string[]; // Array of tenant IDs user has access to
  lastLogin: Date;
  isActive: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
}

export type UserPermission = 
  | 'admin.full_access'
  | 'glops.read'
  | 'glops.write'
  | 'customer.read'
  | 'customer.write'
  | 'banking.read'
  | 'banking.write'
  | 'vpb.read'
  | 'vpb.write'
  | 'sports.read'
  | 'sports.write'
  | 'games.read'
  | 'games.write'
  | 'lobby.read'
  | 'lobby.write'
  | 'data.read'
  | 'data.write'
  | 'quickfire.read'
  // New simplified permissions for OKTA integration
  | 'GLOPS'
  | 'CUSTOMER_MARKETS'
  | 'BANKING'
  | 'VPB'
  | 'VPB_SCRIPTS'
  | 'SPORTS'
  | 'GAMES'
  | 'DATA_DELIVERY'
  | 'quickfire.write'
  | 'monitoring.read'
  | 'scripts.execute'
  | 'runbooks.read'
  | 'onboarding.manage';

// ===== TENANT & MULTI-TENANCY =====
export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  environment: 'production' | 'staging' | 'development';
  region: string;
  status: TenantStatus;
  configuration: TenantConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

export type TenantStatus = 'active' | 'inactive' | 'maintenance' | 'suspended';

export interface TenantConfiguration {
  apiEndpoints: Record<string, string>;
  features: TenantFeature[];
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  limits: {
    maxUsers: number;
    maxApiCalls: number;
  };
}

export type TenantFeature = 
  | 'glops'
  | 'customer_markets'
  | 'banking'
  | 'vpb'
  | 'sports'
  | 'games'
  | 'lobby'
  | 'data_delivery'
  | 'quickfire';

// ===== GAMING METRICS & DASHBOARD =====
export interface DashboardMetrics {
  systemStatus: SystemStatus;
  activeUsers: UserMetrics;
  performance: PerformanceMetrics;
  serverLoad: ServerMetrics;
  revenue: RevenueMetrics;
  alerts: Alert[];
  lastUpdated: Date;
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance' | 'outage';
  uptime: number; // percentage
  services: ServiceStatus[];
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  responseTime: number; // ms
  lastCheck: Date;
}

export interface UserMetrics {
  total: number;
  active: number;
  online: number;
  registrations24h: number;
  peakConcurrent: number;
}

export interface PerformanceMetrics {
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  networkLatency: number; // ms
  errorRate: number; // percentage
}

export interface ServerMetrics {
  load: number; // percentage
  connections: number;
  requestsPerSecond: number;
  responseTime: number; // ms
  throughput: number; // requests/sec
}

export interface RevenueMetrics {
  totalRevenue24h: number;
  totalRevenue7d: number;
  totalRevenue30d: number;
  averageBetSize: number;
  ggrMargin: number; // percentage
  currency: string;
}

// ===== ALERTS & MONITORING =====
export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  source: string;
  category: AlertCategory;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertCategory = 
  | 'system'
  | 'security'
  | 'performance'
  | 'business'
  | 'compliance'
  | 'infrastructure';

// ===== API RESPONSES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: Date;
  };
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// ===== QUERY & LOADING STATES =====
export interface QueryState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// ===== WEBSOCKET EVENTS =====
export type WebSocketEventType = 
  | 'metrics_update'
  | 'alert_created'
  | 'alert_resolved'
  | 'user_login'
  | 'user_logout'
  | 'system_status_change'
  | 'tenant_switch';

export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  payload: T;
  timestamp: Date;
  tenantId: string;
}

// ===== AUDIT & LOGGING =====
export interface AuditLog {
  id: string;
  userId: string;
  tenantId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ===== GAMING PLATFORM SPECIFIC =====
export interface GamingSession {
  id: string;
  userId: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  betsPlaced: number;
  totalWagered: number;
  totalWon: number;
  netResult: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface GameStatistics {
  gameId: string;
  gameName: string;
  category: string;
  activeSessions: number;
  totalSessions24h: number;
  revenue24h: number;
  rtp: number; // Return to Player percentage
  popularityRank: number;
}