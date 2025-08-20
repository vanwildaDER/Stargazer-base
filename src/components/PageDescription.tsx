import React from 'react';
import { Info, Image } from 'lucide-react';

interface PageDescriptionProps {
  title: string;
  description: string;
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  codeExample?: string;
  className?: string;
}

const PageDescription: React.FC<PageDescriptionProps> = ({
  title,
  description,
  images = [],
  codeExample,
  className = ""
}) => {
  return (
    <div className={`bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                    border border-secondary-200 dark:border-secondary-700 shadow-lg ${className}`}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          {title}
        </h1>
        <div className="text-secondary-700 dark:text-secondary-300 leading-relaxed space-y-2">
          <div dangerouslySetInnerHTML={{ __html: description }} />
          
          {codeExample && (
            <div className="mt-4">
              <code className="bg-secondary-100 dark:bg-secondary-700 px-3 py-2 rounded-lg text-sm font-mono block overflow-x-auto">
                {codeExample}
              </code>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-secondary-500" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Visual Examples
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <div className="relative group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700
                             transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                    onClick={() => window.open(image.src, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                </div>
                {image.caption && (
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDescription;