# Stargazer

A comprehensive management portal and admin interface for gaming/casino platform ecosystems. Stargazer provides unified access to monitoring, deployment, game library management, workflow automation, and system administration tools.

## Overview

Stargazer serves as a centralized dashboard for managing complex gaming platform operations, featuring:

- **Real-time Monitoring** - Live service status, deployment tracking, and system metrics
- **Game Library Management** - Comprehensive game catalog with provider integration
- **Workflow Automation** - Automated operations and maintenance tasks
- **Documentation Hub** - Troubleshooting runbooks and operational procedures
- **Administrative Tools** - User management, environment controls, and system configuration

## Technology Stack

- **React 18** with TypeScript - Modern UI framework with strict typing
- **Vite 4.4** - Fast build tool and development server (port 3000)
- **Tailwind CSS** - Utility-first CSS with custom gaming theme
- **TanStack Query** - Server state management and caching
- **Recharts** - Data visualization for dashboards
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd stargazer

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev          # Start Vite dev server on port 3000
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build
npm run lint         # ESLint with TypeScript rules
```

## Security & Credential Management

Stargazer implements enterprise-grade security for API credential management with AES-256-GCM encryption.

### Encrypted Credential Storage

For production environments, API keys and secrets should be stored encrypted:

#### 1. Generate Master Password

```bash
node scripts/encrypt-credentials.js generate
```

This creates a secure master password for encrypting/decrypting credentials.

#### 2. Encrypt Individual Credentials

```bash
node scripts/encrypt-credentials.js encrypt \
  --key "VPB_API_KEY" \
  --value "your-actual-api-key" \
  --password "your-master-password"
```

#### 3. Batch Encrypt Environment File

```bash
# Create .env.plain with your plain-text credentials
node scripts/encrypt-credentials.js batch \
  --file ".env.plain" \
  --password "your-master-password"
```

#### 4. Environment Configuration

Add the master password to your environment:

```bash
# .env
VITE_CREDENTIAL_MASTER_PASSWORD=your_master_password_here

# Encrypted credentials appear as JSON objects
VITE_VPB_API_KEY={"encrypted":"...","iv":"...","salt":"...","algorithm":"AES-GCM"}
VITE_VPB_API_SECRET={"encrypted":"...","iv":"...","salt":"...","algorithm":"AES-GCM"}
```

### Security Features

- **AES-256-GCM Encryption** - Military-grade encryption with authentication
- **PBKDF2 Key Derivation** - 100,000 iterations with random salts  
- **Automatic Detection** - Seamlessly handles encrypted and plain-text credentials
- **Token Caching** - Intelligent caching with 5-minute security expiry
- **Production Validation** - Prevents deployment without required credentials
- **Master Password Flexibility** - Supports environment variables and deployment keys

### API Integration

The application automatically handles encrypted credentials through the API client:

```typescript
import { vpbAPI, gamingAPI } from '@/services/apiClient';

// These calls automatically decrypt credentials as needed
const journeys = await vpbAPI.getAllJourneys();
const metrics = await gamingAPI.getSystemStatus();
```

## Platform Integration

Designed to integrate with:
- **VirtualPitBoss (VPB)** - Gaming platform API with proxy configuration
- **Pagerduty** - Alert and incident management
- **Remedy** - IT service management
- **Production Servers** - Direct gaming platform integration

## Architecture

Modern single-page React application with:

- **Multi-level Navigation** - Three-tier navigation (main → sub → tertiary)
- **Role-based Permissions** - Granular access control for gaming operations
- **Multi-tenant Support** - Different operator environment support
- **Real-time Dashboard** - WebSocket integration for live updates
- **Dark-themed UI** - Custom gaming-optimized design system
- **Error Boundaries** - Comprehensive error handling with contextual fallbacks
- **Responsive Design** - Mobile-first approach with gaming aesthetics
