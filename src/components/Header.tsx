import React from 'react';
import { Star } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { UserProfile } from './auth/UserProfile';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onLogoClick();
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-lg 
                       border-b border-secondary-200 dark:border-secondary-700 z-50"
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-6">
        <button 
          onClick={onLogoClick}
          onKeyDown={handleKeyDown}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-lg p-1"
          aria-label="Return to dashboard home"
          title="Return to dashboard home"
        >
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg" aria-hidden="true">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 
                         dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
            Stargazer
          </h1>
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">
            Global Operations Management
          </span>
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;