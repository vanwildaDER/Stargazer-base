import { MenuItem, UserPermission } from '../types';

// Page definition interface - each page defined once with all metadata
interface PageDefinition {
  id: string;
  name: string;
  route: string;
  component?: string; // Component name for lazy loading
  section: string; // Main section (glops-general, customer-markets, etc.)
  category: string; // Sub-category (general, monitoring, runbooks, scripts, onboarding)
  order?: number; // Order within category (auto-generated if not specified)
  permissions?: UserPermission[]; // Additional permissions beyond section permissions
  description?: string;
  isActive?: boolean; // Whether page is available
}

// Master page registry - edit this to move pages or add new ones
export const pageRegistry: PageDefinition[] = [
  // VPB Pages
  {
    id: 'vpb-runbooks-couchbase-document-edit',
    name: 'How to Edit a VPB Couchbase Document',
    route: '/virtualpitboss/runbooks/couchbase-document-edit',
    component: 'VPBCouchbaseDocumentRunbook',
    section: 'virtualpitboss',
    category: 'runbooks',
    order: 1,
    description: 'Step-by-step guide for editing VPB Couchbase documents'
  },
  {
    id: 'vpb-scripts-single-journey-definition',
    name: 'Single Journey Definition',
    route: '/virtualpitboss/scripts/single-journey-definition',
    component: 'SingleJourneyDefinition',
    section: 'virtualpitboss',
    category: 'scripts',
    order: 1,
    permissions: ['VPB_SCRIPTS' as UserPermission],
    description: 'API tool for retrieving single journey definitions'
  },
  {
    id: 'vpb-scripts-get-all-journeys',
    name: 'Get All Journeys',
    route: '/virtualpitboss/scripts/get-all-journeys',
    component: 'GetAllJourneys',
    section: 'virtualpitboss',
    category: 'scripts',
    order: 2,
    permissions: ['VPB_SCRIPTS' as UserPermission],
    description: 'API tool for retrieving all journey definitions'
  },
  {
    id: 'vpb-scripts-powershell',
    name: 'PowerShell Scripts',
    route: '/virtualpitboss/scripts/powershell',
    component: 'VPBPowershellScripts',
    section: 'virtualpitboss',
    category: 'scripts',
    order: 3,
    permissions: ['VPB_SCRIPTS' as UserPermission],
    description: 'Collection of PowerShell scripts for VPB operations'
  },
  {
    id: 'vpb-onboarding-platform-overview',
    name: 'VPB.Next Platform Overview',
    route: '/virtualpitboss/onboarding/platform-overview',
    component: 'VPBNextOverview',
    section: 'virtualpitboss',
    category: 'onboarding',
    order: 1,
    description: 'Comprehensive overview of the VPB.Next platform'
  },
  {
    id: 'vpb-onboarding-technical-deepdive',
    name: 'Technical Deep Dive & Architecture',
    route: '/virtualpitboss/onboarding/technical-deepdive',
    component: 'VPBTechnicalDeepDive',
    section: 'virtualpitboss',
    category: 'onboarding',
    order: 2,
    description: 'Technical architecture and implementation details'
  }
];

// Section configuration - defines main navigation structure
interface SectionConfig {
  id: string;
  name: string;
  permissions: UserPermission[];
  categories: {
    id: string;
    name: string;
    permissions?: UserPermission[];
  }[];
}

export const sectionConfig: SectionConfig[] = [
  {
    id: 'glops-general',
    name: 'GLOPS General',
    permissions: ['GLOPS' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'customer-markets',
    name: 'Customer & Markets',
    permissions: ['CUSTOMER_MARKETS' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'banking',
    name: 'Banking',
    permissions: ['BANKING' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'virtualpitboss',
    name: 'VirtualPitBoss (VPB)',
    permissions: ['VPB' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts', permissions: ['VPB_SCRIPTS' as UserPermission] },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    permissions: ['SPORTS' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'games',
    name: 'Games',
    permissions: ['GAMES' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  },
  {
    id: 'data-delivery',
    name: 'Data Delivery',
    permissions: ['DATA_DELIVERY' as UserPermission],
    categories: [
      { id: 'general', name: 'General' },
      { id: 'monitoring', name: 'Monitoring' },
      { id: 'runbooks', name: 'Runbooks' },
      { id: 'scripts', name: 'Scripts' },
      { id: 'onboarding', name: 'Onboarding' }
    ]
  }
];

// Navigation generator - automatically creates navigation structure from registry
export function generateNavigationFromRegistry(): MenuItem[] {
  const navigationItems: MenuItem[] = [];

  sectionConfig.forEach(section => {
    const subItems = section.categories.map(category => {
      // Get pages for this section/category
      const categoryPages = pageRegistry
        .filter(page => page.section === section.id && page.category === category.id)
        .sort((a, b) => (a.order || 999) - (b.order || 999));

      // Generate tertiary items from pages, or placeholders if no pages
      const tertiaryItems = categoryPages.length > 0 
        ? categoryPages.map(page => ({
            id: page.id,
            name: page.name,
            route: page.route
          }))
        : [
            { 
              id: `${section.id}-${category.id}-placeholder1`, 
              name: 'placeholder1', 
              route: `/${section.id}/${category.id}/placeholder1` 
            },
            { 
              id: `${section.id}-${category.id}-placeholder2`, 
              name: 'placeholder2', 
              route: `/${section.id}/${category.id}/placeholder2` 
            }
          ];

      return {
        id: `${section.id}-${category.id}`,
        name: category.name,
        route: `/${section.id}/${category.id}`,
        permissions: category.permissions,
        tertiaryItems
      };
    });

    navigationItems.push({
      id: section.id,
      name: section.name,
      permissions: section.permissions,
      subItems
    });
  });

  return navigationItems;
}

// Helper functions for page management
export function getPageDefinition(pageId: string): PageDefinition | undefined {
  return pageRegistry.find(page => page.id === pageId);
}

export function getPagesBySection(sectionId: string): PageDefinition[] {
  return pageRegistry.filter(page => page.section === sectionId);
}

export function getPagesByCategory(sectionId: string, categoryId: string): PageDefinition[] {
  return pageRegistry.filter(page => page.section === sectionId && page.category === categoryId);
}

// Component mapping for dynamic imports
export const componentMap: Record<string, () => Promise<any>> = {
  VPBCouchbaseDocumentRunbook: () => import('../components/VPBCouchbaseDocumentRunbook'),
  SingleJourneyDefinition: () => import('../components/SingleJourneyDefinition'),
  GetAllJourneys: () => import('../components/GetAllJourneys'),
  VPBPowershellScripts: () => import('../components/VPBPowershellScripts'),
  VPBNextOverview: () => import('../components/VPBNextOverview'),
  VPBTechnicalDeepDive: () => import('../components/VPBTechnicalDeepDive')
};