import React, { lazy, Suspense, useMemo } from 'react';
import { componentMap, pageRegistry } from '../data/pageRegistry';
import PageTemplate from './_PageTemplate';

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
    return <NotFoundPage />;
  }

  if (!LazyComponent) {
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