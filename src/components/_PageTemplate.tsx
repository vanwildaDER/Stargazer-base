import React from 'react';
import PageDescription from './PageDescription';

// This is a template component for creating new pages with consistent structure
// Copy this file and rename it for your new page component

interface PageTemplateProps {
  // Add your specific props here
}

const PageTemplate: React.FC<PageTemplateProps> = () => {
  return (
    <div className="w-full p-6 space-y-6">
      {/* Page Description - REQUIRED for all pages */}
      <PageDescription
        title="Your Page Title"
        description="Description of what this page does. You can use <strong>HTML tags</strong> for formatting. Explain the purpose, functionality, and any important details about this feature."
        codeExample="http://api3.mit.mgsops.com:7725/Account/endpoint/example"
        images={[
          {
            src: "/api/placeholder/400/300",
            alt: "Descriptive alt text",
            caption: "Caption explaining what this image shows"
          },
          // Add more images as needed
        ]}
      />

      {/* Main Content Section */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Main Content Section
        </h2>
        
        {/* Add your form elements, controls, etc. here */}
        <div className="space-y-4">
          {/* Example form element */}
          <div>
            <label htmlFor="example-input" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Example Input <span className="text-red-500">*</span>
            </label>
            <input
              id="example-input"
              type="text"
              className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                         bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         placeholder-secondary-400 dark:placeholder-secondary-500"
              placeholder="Enter something..."
            />
          </div>

          {/* Example button */}
          <button
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg 
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 
                       focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Results/Output Section (if applicable) */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Results Section
        </h2>
        
        {/* Add your results display here */}
        <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4">
          <p className="text-secondary-700 dark:text-secondary-300">
            Results or output content goes here...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageTemplate;