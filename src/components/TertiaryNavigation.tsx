import React from 'react';
import { TertiaryMenuItem } from '../types';

interface TertiaryNavigationProps {
  tertiaryItems: TertiaryMenuItem[];
  activeTertiaryItem: string | null;
  onTertiaryItemClick: (tertiaryItemId: string) => void;
  parentSubItemName: string;
}

const TertiaryNavigation: React.FC<TertiaryNavigationProps> = ({ 
  tertiaryItems, 
  activeTertiaryItem, 
  onTertiaryItemClick,
  parentSubItemName
}) => {
  const handleKeyDown = (event: React.KeyboardEvent, tertiaryItemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTertiaryItemClick(tertiaryItemId);
    }
  };

  if (!tertiaryItems || tertiaryItems.length === 0) return null;

  return (
    <div 
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white/40 dark:bg-slate-800/40 
                    backdrop-blur-md border-l border-secondary-200/60 dark:border-slate-600/50 
                    shadow-lg z-20 overflow-y-auto"
      role="navigation"
      aria-label={`${parentSubItemName} sub-navigation`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="p-4">
        {/* Header with subtle visual hierarchy */}
        <div className="mb-4 pb-3 border-b border-secondary-200/40 dark:border-slate-600/40">
          <h3 className="text-sm font-medium text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
            {parentSubItemName}
          </h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
            Sub-navigation
          </p>
        </div>
        
        {/* Navigation items with sophisticated styling */}
        <nav className="space-y-1" role="list">
          {tertiaryItems.map((item: TertiaryMenuItem, index: number) => (
            <button
              key={item.id}
              className={`tertiary-nav-item group relative overflow-hidden w-full text-left px-4 py-3 
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-1 
                         dark:focus:ring-offset-slate-800 transition-all duration-300 ease-in-out
                         hover:shadow-md hover:translate-x-1 transform
                         ${activeTertiaryItem === item.id 
                           ? 'bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 shadow-sm border border-primary-200/50 dark:border-primary-700/50' 
                           : 'hover:bg-white/60 dark:hover:bg-slate-700/60'
                         }`}
              onClick={() => onTertiaryItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              role="listitem"
              aria-current={activeTertiaryItem === item.id ? 'page' : undefined}
              tabIndex={0}
              style={{ 
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.4s ease-out forwards'
              }}
            >
              {/* Subtle active indicator */}
              {activeTertiaryItem === item.id && (
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 
                              bg-gradient-to-b from-primary-500 to-accent-500 rounded-r-full"
                  aria-hidden="true"
                />
              )}
              
              {/* Content with proper typography hierarchy */}
              <div className="relative z-10 flex items-center justify-between">
                <span className={`text-sm font-medium transition-colors duration-200
                                ${activeTertiaryItem === item.id 
                                  ? 'text-primary-700 dark:text-primary-300' 
                                  : 'text-secondary-700 dark:text-secondary-300 group-hover:text-secondary-900 dark:group-hover:text-secondary-100'
                                }`}>
                  {item.name}
                </span>
                
                {/* Subtle chevron for visual clarity */}
                <div className={`w-4 h-4 flex items-center justify-center transition-all duration-200
                               ${activeTertiaryItem === item.id 
                                 ? 'opacity-100 scale-110' 
                                 : 'opacity-0 scale-90 group-hover:opacity-60 group-hover:scale-100'
                               }`}>
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200
                                 ${activeTertiaryItem === item.id 
                                   ? 'bg-primary-500 dark:bg-primary-400' 
                                   : 'bg-secondary-400 dark:bg-secondary-500'
                                 }`} 
                       aria-hidden="true" />
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" 
                   aria-hidden="true" />
            </button>
          ))}
        </nav>
        
        {/* Breadcrumb indicator at bottom */}
        <div className="mt-6 pt-4 border-t border-secondary-200/40 dark:border-slate-600/40">
          <div className="flex items-center space-x-2 text-xs text-secondary-500 dark:text-secondary-500">
            <div className="w-2 h-2 rounded-full bg-secondary-300 dark:bg-secondary-600" aria-hidden="true" />
            <span>Level 3 Navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the animation keyframes to the CSS if not already present
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .tertiary-nav-item {
    opacity: 0;
  }
`;

// Inject styles if they don't exist
if (typeof document !== 'undefined' && !document.getElementById('tertiary-nav-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'tertiary-nav-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default TertiaryNavigation;