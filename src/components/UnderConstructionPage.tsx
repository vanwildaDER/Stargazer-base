import React from 'react';
import { Construction, Clock, Settings } from 'lucide-react';
import PageTemplate from './_PageTemplate';

interface UnderConstructionPageProps {
  title?: string;
  section?: string;
  category?: string;
}

const UnderConstructionPage: React.FC<UnderConstructionPageProps> = ({ 
  title = "Under Construction", 
  section = "this section",
  category = "feature"
}) => {
  return (
    <PageTemplate 
      title={title}
      description={`This ${category} page is currently under development. Check back soon for updates!`}
    >
      <div className="flex flex-col items-center justify-center py-16 px-8">
        {/* Construction Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center border-4 border-amber-200 dark:border-amber-700">
            <Construction className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          {/* Animated gear */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center border-2 border-primary-200 dark:border-primary-700 animate-spin" style={{ animationDuration: '3s' }}>
            <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 text-center">
          Coming Soon
        </h2>
        
        <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 text-center max-w-md">
          We're working hard to bring you amazing {category} tools for {section}. 
          This page will be available soon!
        </p>

        {/* Status Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              In Development
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Our team is actively building this feature
            </p>
          </div>

          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Testing Phase
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Ensuring quality and reliability
            </p>
          </div>

          <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Construction className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Coming Soon
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Ready for launch very soon
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mt-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Development Progress
            </span>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              75%
            </span>
          </div>
          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
            Want to be notified when this feature is ready?
          </p>
          <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800">
            Stay Updated
          </button>
        </div>
      </div>
    </PageTemplate>
  );
};

export default UnderConstructionPage;