import React from 'react';
import { X } from 'lucide-react';
import { navigationItems } from '../data/navigation';
import { SubMenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import TertiaryNavigation from './TertiaryNavigation';
import PageRenderer from './PageRenderer';

interface SubPanelProps {
  activeMainItem: string | null;
  activeSubItem: string | null;
  activeTertiaryItem: string | null;
  onSubItemClick: (subItemId: string) => void;
  onTertiaryItemClick: (tertiaryItemId: string) => void;
  onClose: () => void;
}

const SubPanel: React.FC<SubPanelProps> = ({ 
  activeMainItem, 
  activeSubItem,
  activeTertiaryItem, 
  onSubItemClick,
  onTertiaryItemClick, 
  onClose 
}) => {
  const { hasPermission } = useAuth();
  const handleKeyDown = (event: React.KeyboardEvent, subItemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSubItemClick(subItemId);
    }
  };

  const handleCloseKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClose();
    }
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!activeMainItem) return null;

  const mainItem = navigationItems.find(item => item.id === activeMainItem);
  if (!mainItem) return null;

  // Filter sub-items based on permissions
  const visibleSubItems = mainItem.subItems.filter((subItem: SubMenuItem) => {
    if (!subItem.permissions || subItem.permissions.length === 0) return true;
    return subItem.permissions.some(permission => hasPermission(permission));
  });

  const currentSubItem = activeSubItem ? visibleSubItems.find(sub => sub.id === activeSubItem) : null;

  return (
    <>
      <div 
        className={`fixed left-80 top-0 h-full bg-gradient-to-br from-primary-50/95 to-accent-50/95 
                      dark:bg-gradient-to-br dark:from-slate-600/50 dark:to-slate-500/50 backdrop-blur-lg 
                      border-r border-secondary-200 dark:border-slate-400/50 shadow-xl z-30
                      animate-in slide-in-from-left duration-300 overflow-y-auto
                      ${activeSubItem ? 'right-56' : 'right-0'}`}
        role="region"
        aria-label={`${mainItem.name} submenu`}
        aria-live="polite"
      >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-accent-700 dark:text-accent-300">
            {mainItem.name}
          </h2>
          <button
            onClick={onClose}
            onKeyDown={handleCloseKeyDown}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 
                       text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-600"
            aria-label="Close submenu"
            title="Close submenu (Escape)"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        
        <nav className="space-y-1" role="tablist" aria-label={`${mainItem.name} options`}>
          <div className="flex space-x-1 mb-4 bg-white/50 dark:bg-secondary-700/50 rounded-lg p-1 backdrop-blur-sm">
            {visibleSubItems.map((subItem: SubMenuItem) => (
              <button
                key={subItem.id}
                onClick={() => onSubItemClick(subItem.id)}
                onKeyDown={(e) => handleKeyDown(e, subItem.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-slate-600
                           ${activeSubItem === subItem.id 
                             ? 'bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-800 dark:to-accent-800 text-primary-700 dark:text-primary-300 shadow-sm' 
                             : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-200 hover:bg-white/30 dark:hover:bg-secondary-600/30'
                           }`}
                role="tab"
                aria-selected={activeSubItem === subItem.id}
                aria-controls={`tabpanel-${subItem.id}`}
                id={`tab-${subItem.id}`}
                tabIndex={activeSubItem === subItem.id ? 0 : -1}
              >
                {subItem.name}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="mt-8 flex-1 overflow-hidden">
          <div 
            className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 
                          rounded-lg border border-primary-200 dark:border-primary-700 h-full flex flex-col"
            role="tabpanel"
            id={activeSubItem ? `tabpanel-${activeSubItem}` : 'tabpanel-empty'}
            aria-labelledby={activeSubItem ? `tab-${activeSubItem}` : undefined}
            tabIndex={0}
          >
            {activeTertiaryItem ? (
              <div className="overflow-y-auto flex-1">
                <PageRenderer currentPageId={activeTertiaryItem} />
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-lg font-medium text-primary-800 dark:text-primary-200 mb-2">
                  {activeSubItem ? mainItem.subItems.find(sub => sub.id === activeSubItem)?.name : 'Select an option'}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {activeSubItem 
                    ? activeTertiaryItem 
                      ? 'Please select a tool from the right panel to get started.'
                      : `Content for ${mainItem.name} - ${mainItem.subItems.find(sub => sub.id === activeSubItem)?.name} will be displayed here.`
                    : 'Please select a tab above to view the content.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Tertiary Navigation Panel */}
      {activeSubItem && currentSubItem?.tertiaryItems && (
        <TertiaryNavigation
          tertiaryItems={currentSubItem.tertiaryItems}
          activeTertiaryItem={activeTertiaryItem}
          onTertiaryItemClick={onTertiaryItemClick}
          parentSubItemName={currentSubItem.name}
        />
      )}
    </>
  );
};

export default SubPanel;