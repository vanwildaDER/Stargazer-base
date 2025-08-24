import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginCallback } from './components/auth/LoginCallback';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SubPanel from './components/SubPanel';
import MainContent from './components/MainContent';
import ErrorBoundary from './components/ErrorBoundary';
import { navigationItems } from './data/navigation';
import { env } from './config/env';

function App() {
  const [activeMainItem, setActiveMainItem] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const [activeTertiaryItem, setActiveTertiaryItem] = useState<string | null>(null);

  const handleMainItemClick = (itemId: string) => {
    if (activeMainItem === itemId) {
      setActiveMainItem(null);
      setActiveSubItem(null);
      setActiveTertiaryItem(null);
    } else {
      setActiveMainItem(itemId);
      setActiveSubItem(null);
      setActiveTertiaryItem(null);
    }
  };

  const handleSubItemClick = (subItemId: string) => {
    setActiveSubItem(subItemId);
    // Auto-select first tertiary item when switching sub items
    const currentMainItem = navigationItems.find(item => item.id === activeMainItem);
    if (currentMainItem) {
      const currentSubItem = currentMainItem.subItems.find(sub => sub.id === subItemId);
      if (currentSubItem?.tertiaryItems && currentSubItem.tertiaryItems.length > 0) {
        setActiveTertiaryItem(currentSubItem.tertiaryItems[0].id);
      } else {
        setActiveTertiaryItem(null);
      }
    }
  };

  const handleTertiaryItemClick = (tertiaryItemId: string) => {
    setActiveTertiaryItem(tertiaryItemId);
  };

  const handleSubPanelClose = () => {
    setActiveMainItem(null);
    setActiveSubItem(null);
    setActiveTertiaryItem(null);
  };

  const handleLogoClick = () => {
    setActiveMainItem(null);
    setActiveSubItem(null);
    setActiveTertiaryItem(null);
  };

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with context for gaming platform monitoring
    console.error('Application Error:', {
      error: error.message,
      stack: error.stack,
      component: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      environment: env.APP_ENVIRONMENT,
      userAgent: navigator.userAgent
    });
  };

  const DashboardLayout = () => (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark">
      <ErrorBoundary fallback={
        <div className="fixed top-0 left-0 right-0 bg-red-100 dark:bg-red-900/30 border-b border-red-300 dark:border-red-700 p-3 text-center z-50">
          <span className="text-red-800 dark:text-red-300 text-sm font-medium">
            Header component encountered an error. Please refresh the page.
          </span>
        </div>
      }>
        <Header onLogoClick={handleLogoClick} />
      </ErrorBoundary>
      
      <div className="relative">
        <ErrorBoundary fallback={
          <div className="pt-16 pb-8 px-8 pl-80 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Dashboard Unavailable
              </h2>
              <p className="text-secondary-600 dark:text-secondary-400">
                The main dashboard is temporarily unavailable. Please try refreshing the page.
              </p>
            </div>
          </div>
        }>
          <MainContent 
            isSubPanelOpen={!!activeMainItem} 
            isTertiaryNavOpen={!!activeSubItem} 
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Sidebar 
            activeMainItem={activeMainItem}
            onMainItemClick={handleMainItemClick}
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <SubPanel
            activeMainItem={activeMainItem}
            activeSubItem={activeSubItem}
            activeTertiaryItem={activeTertiaryItem}
            onSubItemClick={handleSubItemClick}
            onTertiaryItemClick={handleTertiaryItemClick}
            onClose={handleSubPanelClose}
          />
        </ErrorBoundary>
      </div>
    </div>
  );

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <Routes>
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;