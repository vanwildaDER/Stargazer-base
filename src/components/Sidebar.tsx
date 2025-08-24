import React from 'react';
import { navigationItems } from '../data/navigation';
import { MenuItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeMainItem: string | null;
  onMainItemClick: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMainItem, onMainItemClick }) => {
  const { hasPermission } = useAuth();
  
  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onMainItemClick(itemId);
    }
  };

  // Filter navigation items based on permissions
  const visibleNavigationItems = navigationItems.filter((item: MenuItem) => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some(permission => hasPermission(permission));
  });

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-80 bg-white/80 dark:bg-slate-700/70 backdrop-blur-lg 
                    border-r border-secondary-200 dark:border-slate-600 shadow-xl z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-6">
          Navigation
        </h2>
        <nav className="space-y-2" role="list">
          {visibleNavigationItems.map((item: MenuItem) => (
            <button
              key={item.id}
              className={`nav-item group relative overflow-hidden w-full text-left p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-700 transition-all duration-200 ${activeMainItem === item.id ? 'active' : ''}`}
              onClick={() => onMainItemClick(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              role="listitem"
              aria-expanded={activeMainItem === item.id}
              aria-describedby={`nav-item-${item.id}-desc`}
              tabIndex={0}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 
                               dark:from-primary-400/20 dark:to-accent-400/20 opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
              <span className={`font-medium relative z-10 block ${activeMainItem === item.id 
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-300 dark:to-accent-300 bg-clip-text text-transparent' 
                : 'text-secondary-700 dark:text-secondary-300'}`}>
                {item.name}
              </span>
              <span id={`nav-item-${item.id}-desc`} className="sr-only">
                {activeMainItem === item.id ? 'Currently selected' : 'Click to expand'} {item.name} section
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;