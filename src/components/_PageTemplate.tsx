import React from 'react';
import PageDescription from './PageDescription';

// This is a template component for creating new pages with consistent structure
// Copy this file and rename it for your new page component

interface PageTemplateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, description, children }) => {
  return (
    <div className="w-full p-6 space-y-6">
      {title && description && (
        <PageDescription
          title={title}
          description={description}
        />
      )}
      {children}
    </div>
  );
};

export default PageTemplate;