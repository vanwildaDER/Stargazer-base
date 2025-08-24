# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stargazer is a comprehensive management portal and admin interface for gaming/casino platform ecosystems. It provides unified access to monitoring, deployment, game library management, workflow automation, and system administration tools.

## Technology Stack

### Frontend
- **React 18** with TypeScript - Modern UI framework with strict typing
- **Vite 4.4** - Fast build tool and development server (port 3000)
- **Tailwind CSS** - Utility-first CSS with custom gaming theme
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Recharts** - Data visualization for dashboards
- **Lucide React** - Icon library

### Current Architecture

This is a **single-page React application** (not a monorepo) with:
- **Multi-level navigation** (main → sub → tertiary items)
- **Role-based permissions** system with gaming-specific permissions
- **Multi-tenant architecture** supporting different operator environments
- **Real-time dashboard** with WebSocket events
- **Dark-themed UI** with custom gradients and gaming aesthetics

## Development Commands

```bash
# Development
npm run dev          # Start Vite dev server on port 3000

# Build & Deployment  
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint with TypeScript rules
```

## Project Structure

```
src/
├── components/           # React components
├── types/               # TypeScript type definitions
├── data/               # Static data (navigation config)
├── hooks/              # Custom React hooks
├── config/             # Environment configuration
├── App.tsx             # Main application component
└── main.tsx            # React entry point
```

## Key Architecture Patterns

### Navigation System
Three-tier navigation managed in `App.tsx`:
- **Main items** (sidebar) → **Sub items** (sub-panel) → **Tertiary items**
- State managed via `activeMainItem`, `activeSubItem`, `activeTertiaryItem`
- Auto-selection of first tertiary item when switching sub-items

### Error Boundaries
Comprehensive error handling with contextual fallbacks:
- Application-level error boundary with gaming platform logging
- Component-level boundaries for Header, MainContent, Sidebar, SubPanel
- Error logging includes environment, user agent, and timestamp

### Type System
Extensive TypeScript definitions in `src/types/index.ts`:
- **Gaming-specific types**: `GamingSession`, `GameStatistics`, `RevenueMetrics`
- **Multi-tenancy**: `Tenant`, `TenantConfiguration`, `TenantFeature`
- **Permissions**: Granular permission system for gaming operations
- **Real-time**: WebSocket event types and payloads
- **API**: Standardized response format with error handling

### Styling Approach
- **Dark-first design** with custom Tailwind configuration
- **Gaming theme colors**: Primary (blues), accent (purples), status colors
- **Gradient backgrounds**: Custom light/dark gradients
- **Path aliases**: `@`, `@components`, `@types`, `@hooks`, `@data`

### Development Configuration

#### Vite Config Features
- **Proxy setup** for API calls to gaming backend (`/api/vpb` → gaming API)
- **Path aliases** for clean imports
- **Optimized builds** with manual chunking (vendor, router, icons)
- **Source maps** enabled for debugging

#### TypeScript Config
- **Strict mode** enabled with unused variable detection
- **Modern target** (ES2020) with DOM types
- **Bundler module resolution** for Vite compatibility

## Gaming Platform Integration

### API Endpoints
- VPB (Virtual Pit Boss) API proxy configured at `/api/vpb`
- Target: `api3.mit.mgsops.com:7725`
- Request/response logging enabled for debugging

### Permission-Based Features
The app supports role-based access for:
- **GLOPS** (Gaming License Operations)
- **Customer Markets** management
- **Banking** and financial operations
- **VPB** (Virtual Pit Boss) controls
- **Sports** betting management
- **Games** library administration
- **Data Delivery** services

## API Key Management & Security

ALWAYS save sensitive values in the .env file of the project. Examples of sensitive values would be usernames , password , API keys. IF you find them , stop and ask for permission to change the value to a variable in the code and save the values in the .env file.

### Environment Configuration
API keys are managed through environment variables with strict security practices:

```bash
# In .env (never commit actual values)
VITE_VPB_API_KEY=your_vpb_api_key
VITE_VPB_API_SECRET=your_vpb_api_secret
VITE_GAMING_API_CLIENT_ID=your_gaming_client_id
VITE_GAMING_API_CLIENT_SECRET=your_gaming_client_secret
```

### Security Architecture
1. **Frontend-Backend Separation**: API keys are used for server-side authentication only
2. **Token-Based Authentication**: OAuth2 client credentials flow for service-to-service auth
3. **Vite Proxy**: Development requests proxied to avoid exposing credentials
4. **Production BFF**: Backend-for-Frontend handles all external API authentication
5. **Token Caching**: Automatic token renewal with 1-minute expiry buffer

### API Client Usage
```typescript
import { vpbAPI, gamingAPI } from '@/services/apiClient';

// VPB API calls
const journeys = await vpbAPI.getAllJourneys();
const journey = await vpbAPI.getSingleJourneyDefinition(id);

// Gaming platform calls  
const metrics = await gamingAPI.getSystemStatus();
const revenue = await gamingAPI.getRevenue('24h');
```

### Encrypted Credential Storage
For maximum security, credentials can be stored encrypted in environment files:

```bash
# Generate a master password
node scripts/encrypt-credentials.js generate

# Encrypt a single credential
node scripts/encrypt-credentials.js encrypt \
  --key "VPB_API_KEY" \
  --value "your-secret-key" \
  --password "your-master-password"

# Batch encrypt from .env file
node scripts/encrypt-credentials.js batch \
  --file ".env.plain" \
  --password "your-master-password"
```

Encrypted credentials are stored as JSON objects:
```bash
VITE_VPB_API_KEY={"encrypted":"...","iv":"...","salt":"...","algorithm":"AES-GCM"}
```

### Security Requirements
- **Never commit actual API keys** to version control
- **Encryption recommended**: Use AES-256-GCM encryption for production credentials
- **Master password security**: Store master passwords in secure key management systems
- **Production validation**: Ensures all required credentials are present
- **HTTPS enforcement**: Required for production environments
- **Token security**: Automatic cache clearing and secure storage
- **Credential rotation**: Regularly rotate both API keys and master passwords

## Common Issues & Solutions

### Interactive Image Modal Issues
When implementing click-to-enlarge image functionality in components rendered within SubPanel containers:

**Problem**: Image click handlers not working despite proper event binding
**Root Cause**: Hover overlay divs with `absolute inset-0` positioning block click events from reaching the image elements

**Solution**:
```typescript
// ❌ Incorrect - overlay blocks clicks
<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 flex items-center justify-center">
  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
    Click to enlarge
  </div>
</div>

// ✅ Correct - pointer-events-none allows clicks through
<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 flex items-center justify-center pointer-events-none">
  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
    Click to enlarge
  </div>
</div>
```

**Implementation Pattern**:
```typescript
// Use createPortal for modals to bypass container overflow restrictions
import { createPortal } from 'react-dom';

// Modal rendered to document.body to avoid z-index and overflow issues
{selectedImage && createPortal(
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    {/* Modal content */}
  </div>,
  document.body
)}
```

**Z-Index Stack Reference**:
- Header: `z-50`
- Sidebar: `z-40`  
- SubPanel: `z-30`
- TertiaryNavigation: `z-20`
- Image Modals: `z-[9999]` (highest priority)

**Debugging Steps**:
1. Add temporary `onClick={() => alert('Image clicked!')}` to test if events fire
2. Check for overlapping elements with browser dev tools
3. Verify `pointer-events-none` is applied to hover overlays
4. Ensure modal uses `createPortal` if rendered within constrained containers