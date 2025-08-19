import React, { useState, useEffect } from 'react';
import { Activity, Users, TrendingUp, Server } from 'lucide-react';
import BetsPerMinuteWidget from './BetsPerMinuteWidget';

interface MetricData {
  systemStatus: string;
  activeUsers: number;
  performance: number;
  serverLoad: number;
  isLoading: boolean;
  lastUpdated: Date;
}

interface MainContentProps {
  isSubPanelOpen: boolean;
  isTertiaryNavOpen?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isSubPanelOpen, isTertiaryNavOpen = false }) => {
  const [metrics, setMetrics] = useState<MetricData>({
    systemStatus: 'All Systems Operational',
    activeUsers: 12847,
    performance: 98.7,
    serverLoad: 45,
    isLoading: true,
    lastUpdated: new Date()
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: Math.floor(12000 + Math.random() * 2000),
        performance: Math.round((97 + Math.random() * 3) * 10) / 10,
        serverLoad: Math.round((40 + Math.random() * 20)),
        lastUpdated: new Date(),
        isLoading: false
      }));
    }, 5000); // Update every 5 seconds

    // Initial load delay to simulate API call
    const initialTimeout = setTimeout(() => {
      setMetrics(prev => ({ ...prev, isLoading: false }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  if (isSubPanelOpen) return null;
  
  // Calculate the left padding based on navigation state
  const leftPadding = isTertiaryNavOpen ? 'pl-[544px]' : 'pl-80'; // 80 (sidebar) + 224 (tertiary nav width) + padding
  
  return (
    <main className={`pt-16 pb-8 px-8 ${leftPadding} transition-all duration-300`} role="main" aria-label="Dashboard overview">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Welcome to Stargazer
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400">
            Your comprehensive gaming platform management portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" role="region" aria-label="System metrics">
          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                          border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-300
                          focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
               role="article" aria-labelledby="system-status-title">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg" aria-hidden="true">
                <Activity className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <h3 id="system-status-title" className="font-semibold text-secondary-900 dark:text-secondary-100">System Status</h3>
            </div>
            {metrics.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-success-600" aria-hidden="true"></div>
                <span className="text-sm text-secondary-500" aria-live="polite">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-success-600 dark:text-success-400" aria-live="polite">
                {metrics.systemStatus}
              </p>
            )}
          </div>

          <BetsPerMinuteWidget />

          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                          border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-300
                          focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
               role="article" aria-labelledby="active-users-title">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg" aria-hidden="true">
                <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 id="active-users-title" className="font-semibold text-secondary-900 dark:text-secondary-100">Active Users</h3>
            </div>
            {metrics.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" aria-hidden="true"></div>
                <span className="text-sm text-secondary-500" aria-live="polite">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400" aria-live="polite">
                {metrics.activeUsers.toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                          border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-300
                          focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
               role="article" aria-labelledby="performance-title">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg" aria-hidden="true">
                <TrendingUp className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <h3 id="performance-title" className="font-semibold text-secondary-900 dark:text-secondary-100">Performance</h3>
            </div>
            {metrics.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-600" aria-hidden="true"></div>
                <span className="text-sm text-secondary-500" aria-live="polite">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-accent-600 dark:text-accent-400" aria-live="polite">
                {metrics.performance}%
              </p>
            )}
          </div>

          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                          border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-300
                          focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
               role="article" aria-labelledby="server-load-title">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg" aria-hidden="true">
                <Server className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <h3 id="server-load-title" className="font-semibold text-secondary-900 dark:text-secondary-100">Server Load</h3>
            </div>
            {metrics.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-warning-600" aria-hidden="true"></div>
                <span className="text-sm text-secondary-500" aria-live="polite">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl font-bold text-warning-600 dark:text-warning-400" aria-live="polite">
                {metrics.serverLoad}%
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-8 
                        border border-secondary-200 dark:border-secondary-700"
             role="region" aria-labelledby="getting-started-title">
          <h3 id="getting-started-title" className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Getting Started
          </h3>
          <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-4" aria-live="polite">
            Last updated: {metrics.lastUpdated.toLocaleTimeString()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Navigation</h4>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Use the navigation panel on the right to access different platform sections. 
                Click on any main category to open detailed sub-menus.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-accent-700 dark:text-accent-300 mb-2">Quick Access</h4>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                Each section contains General information, real-time Monitoring, and 
                operational Runbooks for efficient platform management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;