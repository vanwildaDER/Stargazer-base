import React, { lazy, Suspense, useMemo } from 'react';
import { componentMap, pageRegistry } from '../data/pageRegistry';
import PageTemplate from './_PageTemplate';
import UnderConstructionPage from './UnderConstructionPage';

interface PageRendererProps {
  currentPageId: string;
}

const PageRenderer: React.FC<PageRendererProps> = ({ currentPageId }) => {
  
  // Find page definition based on page ID
  const pageDefinition = useMemo(() => {
    return pageRegistry.find(page => page.id === currentPageId);
  }, [currentPageId]);

  // Dynamically load component
  const LazyComponent = useMemo(() => {
    if (!pageDefinition?.component || !componentMap[pageDefinition.component]) {
      return null;
    }
    
    return lazy(componentMap[pageDefinition.component]);
  }, [pageDefinition]);

  // Render loading state
  const LoadingFallback = () => (
    <PageTemplate 
      title="Loading..."
      description="Please wait while the page loads"
    >
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
        <span className="ml-3 text-secondary-600 dark:text-secondary-400">Loading page...</span>
      </div>
    </PageTemplate>
  );

  // Render 404 state
  const NotFoundPage = () => (
    <PageTemplate 
      title="Page Not Found"
      description="The requested page could not be found"
    >
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          The page you're looking for doesn't exist or hasn't been implemented yet.
        </p>
        <div className="text-sm text-secondary-500 dark:text-secondary-500">
          Page ID: {currentPageId}
        </div>
      </div>
    </PageTemplate>
  );

  if (!pageDefinition) {
    // If no page definition found, but it's a placeholder, show under construction
    if (currentPageId.includes('placeholder')) {
      // Extract section and category from the page ID
      const parts = currentPageId.split('-');
      const section = parts.length > 2 ? parts.slice(0, -2).join('-') : 'this section';
      const category = parts.length > 1 ? parts[parts.length - 2] : 'feature';
      
      return (
        <UnderConstructionPage 
          title="Coming Soon"
          section={section}
          category={category}
        />
      );
    }
    return <NotFoundPage />;
  }

  if (!LazyComponent) {
    // For placeholder pages or pages without components, show under construction
    if (pageDefinition.name.toLowerCase().includes('placeholder') || !pageDefinition.component) {
      return (
        <UnderConstructionPage 
          title={pageDefinition.name}
          section={pageDefinition.section}
          category={pageDefinition.category}
        />
      );
    }

    return (
      <PageTemplate 
        title={pageDefinition.name}
        description={pageDefinition.description || "This page is under development"}
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Coming Soon
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400">
            This page is currently under development.
          </p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent />
    </Suspense>
  );
};

export default PageRenderer;