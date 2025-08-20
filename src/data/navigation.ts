import { MenuItem } from '../types';

export const navigationItems: MenuItem[] = [
  {
    id: 'glops-general',
    name: 'GLOPS General',
    subItems: [
      { 
        id: 'glops-general', 
        name: 'General', 
        route: '/glops-general/general',
        tertiaryItems: [
          { id: 'glops-general-placeholder1', name: 'placeholder1', route: '/glops-general/general/placeholder1' },
          { id: 'glops-general-placeholder2', name: 'placeholder2', route: '/glops-general/general/placeholder2' }
        ]
      },
      { 
        id: 'glops-monitoring', 
        name: 'Monitoring', 
        route: '/glops-general/monitoring',
        tertiaryItems: [
          { id: 'glops-monitoring-placeholder1', name: 'placeholder1', route: '/glops-general/monitoring/placeholder1' },
          { id: 'glops-monitoring-placeholder2', name: 'placeholder2', route: '/glops-general/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'glops-runbooks', 
        name: 'Runbooks', 
        route: '/glops-general/runbooks',
        tertiaryItems: [
          { id: 'glops-runbooks-placeholder1', name: 'placeholder1', route: '/glops-general/runbooks/placeholder1' },
          { id: 'glops-runbooks-placeholder2', name: 'placeholder2', route: '/glops-general/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'glops-scripts', 
        name: 'Scripts', 
        route: '/glops-general/scripts',
        tertiaryItems: [
          { id: 'glops-scripts-placeholder1', name: 'placeholder1', route: '/glops-general/scripts/placeholder1' },
          { id: 'glops-scripts-placeholder2', name: 'placeholder2', route: '/glops-general/scripts/placeholder2' }
        ]
      },
      { 
        id: 'glops-onboarding', 
        name: 'Onboarding', 
        route: '/glops-general/onboarding',
        tertiaryItems: [
          { id: 'glops-onboarding-placeholder1', name: 'placeholder1', route: '/glops-general/onboarding/placeholder1' },
          { id: 'glops-onboarding-placeholder2', name: 'placeholder2', route: '/glops-general/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'customer-markets',
    name: 'Customer & Markets',
    subItems: [
      { 
        id: 'customer-general', 
        name: 'General', 
        route: '/customer-markets/general',
        tertiaryItems: [
          { id: 'customer-general-placeholder1', name: 'placeholder1', route: '/customer-markets/general/placeholder1' },
          { id: 'customer-general-placeholder2', name: 'placeholder2', route: '/customer-markets/general/placeholder2' }
        ]
      },
      { 
        id: 'customer-monitoring', 
        name: 'Monitoring', 
        route: '/customer-markets/monitoring',
        tertiaryItems: [
          { id: 'customer-monitoring-placeholder1', name: 'placeholder1', route: '/customer-markets/monitoring/placeholder1' },
          { id: 'customer-monitoring-placeholder2', name: 'placeholder2', route: '/customer-markets/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'customer-runbooks', 
        name: 'Runbooks', 
        route: '/customer-markets/runbooks',
        tertiaryItems: [
          { id: 'customer-runbooks-placeholder1', name: 'placeholder1', route: '/customer-markets/runbooks/placeholder1' },
          { id: 'customer-runbooks-placeholder2', name: 'placeholder2', route: '/customer-markets/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'customer-scripts', 
        name: 'Scripts', 
        route: '/customer-markets/scripts',
        tertiaryItems: [
          { id: 'customer-scripts-placeholder1', name: 'placeholder1', route: '/customer-markets/scripts/placeholder1' },
          { id: 'customer-scripts-placeholder2', name: 'placeholder2', route: '/customer-markets/scripts/placeholder2' }
        ]
      },
      { 
        id: 'customer-onboarding', 
        name: 'Onboarding', 
        route: '/customer-markets/onboarding',
        tertiaryItems: [
          { id: 'customer-onboarding-placeholder1', name: 'placeholder1', route: '/customer-markets/onboarding/placeholder1' },
          { id: 'customer-onboarding-placeholder2', name: 'placeholder2', route: '/customer-markets/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'banking',
    name: 'Banking',
    subItems: [
      { 
        id: 'banking-general', 
        name: 'General', 
        route: '/banking/general',
        tertiaryItems: [
          { id: 'banking-general-placeholder1', name: 'placeholder1', route: '/banking/general/placeholder1' },
          { id: 'banking-general-placeholder2', name: 'placeholder2', route: '/banking/general/placeholder2' }
        ]
      },
      { 
        id: 'banking-monitoring', 
        name: 'Monitoring', 
        route: '/banking/monitoring',
        tertiaryItems: [
          { id: 'banking-monitoring-placeholder1', name: 'placeholder1', route: '/banking/monitoring/placeholder1' },
          { id: 'banking-monitoring-placeholder2', name: 'placeholder2', route: '/banking/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'banking-runbooks', 
        name: 'Runbooks', 
        route: '/banking/runbooks',
        tertiaryItems: [
          { id: 'banking-runbooks-placeholder1', name: 'placeholder1', route: '/banking/runbooks/placeholder1' },
          { id: 'banking-runbooks-placeholder2', name: 'placeholder2', route: '/banking/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'banking-scripts', 
        name: 'Scripts', 
        route: '/banking/scripts',
        tertiaryItems: [
          { id: 'banking-scripts-placeholder1', name: 'placeholder1', route: '/banking/scripts/placeholder1' },
          { id: 'banking-scripts-placeholder2', name: 'placeholder2', route: '/banking/scripts/placeholder2' }
        ]
      },
      { 
        id: 'banking-onboarding', 
        name: 'Onboarding', 
        route: '/banking/onboarding',
        tertiaryItems: [
          { id: 'banking-onboarding-placeholder1', name: 'placeholder1', route: '/banking/onboarding/placeholder1' },
          { id: 'banking-onboarding-placeholder2', name: 'placeholder2', route: '/banking/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'virtualpitboss',
    name: 'VirtualPitBoss (VPB)',
    subItems: [
      { 
        id: 'vpb-general', 
        name: 'General', 
        route: '/virtualpitboss/general',
        tertiaryItems: [
          { id: 'vpb-general-placeholder1', name: 'placeholder1', route: '/virtualpitboss/general/placeholder1' },
          { id: 'vpb-general-placeholder2', name: 'placeholder2', route: '/virtualpitboss/general/placeholder2' }
        ]
      },
      { 
        id: 'vpb-monitoring', 
        name: 'Monitoring', 
        route: '/virtualpitboss/monitoring',
        tertiaryItems: [
          { id: 'vpb-monitoring-placeholder1', name: 'placeholder1', route: '/virtualpitboss/monitoring/placeholder1' },
          { id: 'vpb-monitoring-placeholder2', name: 'placeholder2', route: '/virtualpitboss/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'vpb-runbooks', 
        name: 'Runbooks', 
        route: '/virtualpitboss/runbooks',
        tertiaryItems: [
          { id: 'vpb-runbooks-couchbase-document-edit', name: 'How to Edit a VPB Couchbase Document', route: '/virtualpitboss/runbooks/couchbase-document-edit' },
          { id: 'vpb-runbooks-placeholder2', name: 'placeholder2', route: '/virtualpitboss/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'vpb-scripts', 
        name: 'Scripts', 
        route: '/virtualpitboss/scripts',
        tertiaryItems: [
          { id: 'vpb-scripts-single-journey-definition', name: 'Single Journey Definition', route: '/virtualpitboss/scripts/single-journey-definition' },
          { id: 'vpb-scripts-get-all-journeys', name: 'Get All Journeys', route: '/virtualpitboss/scripts/get-all-journeys' },
          { id: 'vpb-scripts-powershell', name: 'PowerShell Scripts', route: '/virtualpitboss/scripts/powershell' }
        ]
      },
      { 
        id: 'vpb-onboarding', 
        name: 'Onboarding', 
        route: '/virtualpitboss/onboarding',
        tertiaryItems: [
          { id: 'vpb-onboarding-platform-overview', name: 'VPB.Next Platform Overview', route: '/virtualpitboss/onboarding/platform-overview' },
          { id: 'vpb-onboarding-technical-deepdive', name: 'Technical Deep Dive & Architecture', route: '/virtualpitboss/onboarding/technical-deepdive' }
        ]
      }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    subItems: [
      { 
        id: 'sports-general', 
        name: 'General', 
        route: '/sports/general',
        tertiaryItems: [
          { id: 'sports-general-placeholder1', name: 'placeholder1', route: '/sports/general/placeholder1' },
          { id: 'sports-general-placeholder2', name: 'placeholder2', route: '/sports/general/placeholder2' }
        ]
      },
      { 
        id: 'sports-monitoring', 
        name: 'Monitoring', 
        route: '/sports/monitoring',
        tertiaryItems: [
          { id: 'sports-monitoring-placeholder1', name: 'placeholder1', route: '/sports/monitoring/placeholder1' },
          { id: 'sports-monitoring-placeholder2', name: 'placeholder2', route: '/sports/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'sports-runbooks', 
        name: 'Runbooks', 
        route: '/sports/runbooks',
        tertiaryItems: [
          { id: 'sports-runbooks-placeholder1', name: 'placeholder1', route: '/sports/runbooks/placeholder1' },
          { id: 'sports-runbooks-placeholder2', name: 'placeholder2', route: '/sports/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'sports-scripts', 
        name: 'Scripts', 
        route: '/sports/scripts',
        tertiaryItems: [
          { id: 'sports-scripts-placeholder1', name: 'placeholder1', route: '/sports/scripts/placeholder1' },
          { id: 'sports-scripts-placeholder2', name: 'placeholder2', route: '/sports/scripts/placeholder2' }
        ]
      },
      { 
        id: 'sports-onboarding', 
        name: 'Onboarding', 
        route: '/sports/onboarding',
        tertiaryItems: [
          { id: 'sports-onboarding-placeholder1', name: 'placeholder1', route: '/sports/onboarding/placeholder1' },
          { id: 'sports-onboarding-placeholder2', name: 'placeholder2', route: '/sports/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'games',
    name: 'Games',
    subItems: [
      { 
        id: 'games-general', 
        name: 'General', 
        route: '/games/general',
        tertiaryItems: [
          { id: 'games-general-placeholder1', name: 'placeholder1', route: '/games/general/placeholder1' },
          { id: 'games-general-placeholder2', name: 'placeholder2', route: '/games/general/placeholder2' }
        ]
      },
      { 
        id: 'games-monitoring', 
        name: 'Monitoring', 
        route: '/games/monitoring',
        tertiaryItems: [
          { id: 'games-monitoring-placeholder1', name: 'placeholder1', route: '/games/monitoring/placeholder1' },
          { id: 'games-monitoring-placeholder2', name: 'placeholder2', route: '/games/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'games-runbooks', 
        name: 'Runbooks', 
        route: '/games/runbooks',
        tertiaryItems: [
          { id: 'games-runbooks-placeholder1', name: 'placeholder1', route: '/games/runbooks/placeholder1' },
          { id: 'games-runbooks-placeholder2', name: 'placeholder2', route: '/games/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'games-scripts', 
        name: 'Scripts', 
        route: '/games/scripts',
        tertiaryItems: [
          { id: 'games-scripts-placeholder1', name: 'placeholder1', route: '/games/scripts/placeholder1' },
          { id: 'games-scripts-placeholder2', name: 'placeholder2', route: '/games/scripts/placeholder2' }
        ]
      },
      { 
        id: 'games-onboarding', 
        name: 'Onboarding', 
        route: '/games/onboarding',
        tertiaryItems: [
          { id: 'games-onboarding-placeholder1', name: 'placeholder1', route: '/games/onboarding/placeholder1' },
          { id: 'games-onboarding-placeholder2', name: 'placeholder2', route: '/games/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'lobby',
    name: 'Lobby',
    subItems: [
      { 
        id: 'lobby-general', 
        name: 'General', 
        route: '/lobby/general',
        tertiaryItems: [
          { id: 'lobby-general-placeholder1', name: 'placeholder1', route: '/lobby/general/placeholder1' },
          { id: 'lobby-general-placeholder2', name: 'placeholder2', route: '/lobby/general/placeholder2' }
        ]
      },
      { 
        id: 'lobby-monitoring', 
        name: 'Monitoring', 
        route: '/lobby/monitoring',
        tertiaryItems: [
          { id: 'lobby-monitoring-placeholder1', name: 'placeholder1', route: '/lobby/monitoring/placeholder1' },
          { id: 'lobby-monitoring-placeholder2', name: 'placeholder2', route: '/lobby/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'lobby-runbooks', 
        name: 'Runbooks', 
        route: '/lobby/runbooks',
        tertiaryItems: [
          { id: 'lobby-runbooks-placeholder1', name: 'placeholder1', route: '/lobby/runbooks/placeholder1' },
          { id: 'lobby-runbooks-placeholder2', name: 'placeholder2', route: '/lobby/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'lobby-scripts', 
        name: 'Scripts', 
        route: '/lobby/scripts',
        tertiaryItems: [
          { id: 'lobby-scripts-placeholder1', name: 'placeholder1', route: '/lobby/scripts/placeholder1' },
          { id: 'lobby-scripts-placeholder2', name: 'placeholder2', route: '/lobby/scripts/placeholder2' }
        ]
      },
      { 
        id: 'lobby-onboarding', 
        name: 'Onboarding', 
        route: '/lobby/onboarding',
        tertiaryItems: [
          { id: 'lobby-onboarding-placeholder1', name: 'placeholder1', route: '/lobby/onboarding/placeholder1' },
          { id: 'lobby-onboarding-placeholder2', name: 'placeholder2', route: '/lobby/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'datadelivery',
    name: 'DataDelivery',
    subItems: [
      { 
        id: 'data-general', 
        name: 'General', 
        route: '/datadelivery/general',
        tertiaryItems: [
          { id: 'data-general-placeholder1', name: 'placeholder1', route: '/datadelivery/general/placeholder1' },
          { id: 'data-general-placeholder2', name: 'placeholder2', route: '/datadelivery/general/placeholder2' }
        ]
      },
      { 
        id: 'data-monitoring', 
        name: 'Monitoring', 
        route: '/datadelivery/monitoring',
        tertiaryItems: [
          { id: 'data-monitoring-placeholder1', name: 'placeholder1', route: '/datadelivery/monitoring/placeholder1' },
          { id: 'data-monitoring-placeholder2', name: 'placeholder2', route: '/datadelivery/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'data-runbooks', 
        name: 'Runbooks', 
        route: '/datadelivery/runbooks',
        tertiaryItems: [
          { id: 'data-runbooks-placeholder1', name: 'placeholder1', route: '/datadelivery/runbooks/placeholder1' },
          { id: 'data-runbooks-placeholder2', name: 'placeholder2', route: '/datadelivery/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'data-scripts', 
        name: 'Scripts', 
        route: '/datadelivery/scripts',
        tertiaryItems: [
          { id: 'data-scripts-placeholder1', name: 'placeholder1', route: '/datadelivery/scripts/placeholder1' },
          { id: 'data-scripts-placeholder2', name: 'placeholder2', route: '/datadelivery/scripts/placeholder2' }
        ]
      },
      { 
        id: 'data-onboarding', 
        name: 'Onboarding', 
        route: '/datadelivery/onboarding',
        tertiaryItems: [
          { id: 'data-onboarding-placeholder1', name: 'placeholder1', route: '/datadelivery/onboarding/placeholder1' },
          { id: 'data-onboarding-placeholder2', name: 'placeholder2', route: '/datadelivery/onboarding/placeholder2' }
        ]
      }
    ]
  },
  {
    id: 'quickfire',
    name: 'Quickfire',
    subItems: [
      { 
        id: 'qf-general', 
        name: 'General', 
        route: '/quickfire/general',
        tertiaryItems: [
          { id: 'qf-general-placeholder1', name: 'placeholder1', route: '/quickfire/general/placeholder1' },
          { id: 'qf-general-placeholder2', name: 'placeholder2', route: '/quickfire/general/placeholder2' }
        ]
      },
      { 
        id: 'qf-monitoring', 
        name: 'Monitoring', 
        route: '/quickfire/monitoring',
        tertiaryItems: [
          { id: 'qf-monitoring-placeholder1', name: 'placeholder1', route: '/quickfire/monitoring/placeholder1' },
          { id: 'qf-monitoring-placeholder2', name: 'placeholder2', route: '/quickfire/monitoring/placeholder2' }
        ]
      },
      { 
        id: 'qf-runbooks', 
        name: 'Runbooks', 
        route: '/quickfire/runbooks',
        tertiaryItems: [
          { id: 'qf-runbooks-placeholder1', name: 'placeholder1', route: '/quickfire/runbooks/placeholder1' },
          { id: 'qf-runbooks-placeholder2', name: 'placeholder2', route: '/quickfire/runbooks/placeholder2' }
        ]
      },
      { 
        id: 'qf-scripts', 
        name: 'Scripts', 
        route: '/quickfire/scripts',
        tertiaryItems: [
          { id: 'qf-scripts-placeholder1', name: 'placeholder1', route: '/quickfire/scripts/placeholder1' },
          { id: 'qf-scripts-placeholder2', name: 'placeholder2', route: '/quickfire/scripts/placeholder2' }
        ]
      },
      { 
        id: 'qf-onboarding', 
        name: 'Onboarding', 
        route: '/quickfire/onboarding',
        tertiaryItems: [
          { id: 'qf-onboarding-placeholder1', name: 'placeholder1', route: '/quickfire/onboarding/placeholder1' },
          { id: 'qf-onboarding-placeholder2', name: 'placeholder2', route: '/quickfire/onboarding/placeholder2' }
        ]
      }
    ]
  }
];