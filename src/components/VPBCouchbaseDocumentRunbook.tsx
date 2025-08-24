import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Database, Key, Search, Edit3, Save, AlertTriangle, CheckCircle, Copy, ExternalLink, Image, ChevronRight, Clock, User, Link, FileText, Settings } from 'lucide-react';
import PageDescription from './PageDescription';

const VPBCouchbaseDocumentRunbook: React.FC = () => {
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedValue, setCopiedValue] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const copyToClipboard = (text: string, type: 'query' | 'value') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'query') {
        setCopiedQuery(true);
        setTimeout(() => setCopiedQuery(false), 2000);
      } else {
        setCopiedValue(true);
        setTimeout(() => setCopiedValue(false), 2000);
      }
    });
  };

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    if (selectedImage) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]);

  const sqlQuery = `SELECT id FROM vpb_ui
WHERE type = 'JourneyArchive'
AND journey.id = '84066372-9c17-4e68-bbc9-29c83e114f76'
ORDER BY authorData.lastModified DESC
LIMIT 2`;

  const jsonValue = `"hourly": {
  "numberOfHours": 1
},`;

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="How To Edit a VPB Couchbase Document"
        description="<p><strong>Step-by-step runbook</strong> for editing VPB (Virtual Pit Boss) Couchbase documents. This process is required when journey configurations need to be updated or when missing hourly configuration values need to be inserted.</p><p>This runbook covers accessing the Couchbase UI, locating documents by journey ID, and making the necessary configuration updates.</p>"
        codeExample="SELECT id FROM vpb_ui WHERE type = 'JourneyArchive' AND journey.id = 'YOUR_JOURNEY_ID' ORDER BY authorData.lastModified DESC LIMIT 2"
      />

      {/* Quick Access Toolbar */}
      <div className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 dark:from-primary-800/20 dark:to-accent-800/20 
                      backdrop-blur-sm rounded-xl p-4 border border-primary-200/50 dark:border-primary-700/50 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                Est. Time: <span className="text-primary-600 dark:text-primary-400">5-10 minutes</span>
              </span>
            </div>
            <div className="h-4 w-px bg-secondary-300 dark:bg-secondary-600"></div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">Requires: Admin Access</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-secondary-600 dark:text-secondary-400">Progress:</span>
            <div className="flex space-x-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    completedSteps.includes(step)
                      ? 'bg-green-500'
                      : currentStep === step
                      ? 'bg-primary-500'
                      : 'bg-secondary-300 dark:bg-secondary-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process Overview - Streamlined */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          3-Step Process Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              step: 1, 
              title: 'Access Couchbase', 
              desc: 'Launch Citrix Chrome and login', 
              icon: <Key className="w-5 h-5" />,
              time: '2 mins',
              items: ['Launch Citrix', 'Navigate to URL', 'Login']
            },
            { 
              step: 2, 
              title: 'Query Documents', 
              desc: 'Find document IDs by journey ID', 
              icon: <Search className="w-5 h-5" />,
              time: '1 min',
              items: ['Run SQL query', 'Copy document IDs', 'Verify results']
            },
            { 
              step: 3, 
              title: 'Edit & Save', 
              desc: 'Update hourly configuration values', 
              icon: <Edit3 className="w-5 h-5" />,
              time: '2-5 mins',
              items: ['Open documents', 'Insert JSON value', 'Save changes']
            }
          ].map((item) => {
            const isCompleted = completedSteps.includes(item.step);
            const isCurrent = currentStep === item.step;
            
            return (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : isCurrent
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                    : 'bg-secondary-50 dark:bg-secondary-800/30 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-300 dark:bg-secondary-600 text-secondary-600 dark:text-secondary-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : item.icon}
                  </div>
                  <span className="text-xs px-2 py-1 bg-secondary-100 dark:bg-secondary-700 rounded-full text-secondary-600 dark:text-secondary-400">
                    {item.time}
                  </span>
                </div>
                
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">{item.desc}</p>
                
                <ul className="space-y-1">
                  {item.items.map((subItem, idx) => (
                    <li key={idx} className="flex items-center text-xs text-secondary-600 dark:text-secondary-400">
                      <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                      {subItem}
                    </li>
                  ))}
                </ul>
                
                {isCompleted && (
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      ✓ Completed
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="space-y-6">
        
        {/* Step 1: Access Couchbase */}
        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                        border border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Launch Citrix Chrome Browser</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Navigation URL
              </h4>
              <div className="bg-secondary-100 dark:bg-secondary-700 p-3 rounded font-mono text-sm">
                <code>http://couchcachevpb.ait.com:8091/ui/index.html</code>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Login Credentials</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-secondary-700 dark:text-secondary-300 w-20">Username:</span>
                    <code className="bg-secondary-200 dark:bg-secondary-700 px-2 py-1 rounded text-secondary-900 dark:text-secondary-100">Administrator</code>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-secondary-700 dark:text-secondary-300 w-20">Password:</span>
                    <span className="text-secondary-600 dark:text-secondary-400">Retrieved from SD link below</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Password Location
                </h4>
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">Service Desk Password Link:</p>
                <div className="text-xs break-all">
                  <code className="text-yellow-800 dark:text-yellow-200">
                    sd.mgsops.net/Server/ShowByFQDNAndInstanceId?FQDN=ait050.ait.com&IPAddress=10.10.211.23
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Query Documents */}
        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                        border border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Locate Document IDs</h3>
          </div>

          <div className="space-y-4">
            <p className="text-secondary-700 dark:text-secondary-300">
              Run the following query in the Couchbase Query Editor to find the document IDs based on the journey ID:
            </p>

            <div className="relative">
              <div className="bg-secondary-900 dark:bg-secondary-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-secondary-400">SQL Query</span>
                  <button
                    onClick={() => copyToClipboard(sqlQuery, 'query')}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-secondary-700 hover:bg-secondary-600 text-secondary-200 rounded transition-colors"
                  >
                    {copiedQuery ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedQuery ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{sqlQuery}</code>
                </pre>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Important Notes
              </h4>
              <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>• Replace the journey ID in the query with your specific journey ID</li>
                <li>• This query will return the 2 most recent document IDs for the journey</li>
                <li>• Make note of both document IDs returned</li>
              </ul>
            </div>

            {/* Query Results Screenshot */}
            <div className="bg-white dark:bg-secondary-800/50 rounded-lg p-4 border border-secondary-200 dark:border-secondary-700">
              <h4 className="font-medium text-secondary-700 dark:text-secondary-300 mb-3">Query Results Example</h4>
              <div className="relative group cursor-pointer">
                <img 
                  src="/Assets/image-2025-2-13_23-39-19.png" 
                  alt="Couchbase query results showing document IDs for VPB journey"
                  className="w-full h-40 object-cover rounded-lg border border-secondary-200 dark:border-secondary-600 shadow-sm group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setSelectedImage({
                    src: "/Assets/image-2025-2-13_23-39-19.png",
                    alt: "Couchbase query results showing document IDs for VPB journey",
                    caption: "Example query results showing document IDs returned for journey"
                  })}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
                    Click to enlarge
                  </div>
                </div>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                Example query results showing document IDs returned for journey
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Edit Documents */}
        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                        border border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Edit Document Values</h3>
          </div>

          <div className="space-y-4">
            <p className="text-secondary-700 dark:text-secondary-300">
              Retrieve the 2 document IDs from Step 2 and edit them in the Couchbase UI. Insert or update the missing hourly configuration value:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Value to Insert/Update</h4>
                <div className="relative">
                  <div className="bg-secondary-900 dark:bg-secondary-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-secondary-400">JSON Configuration</span>
                      <button
                        onClick={() => copyToClipboard(jsonValue, 'value')}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-secondary-700 hover:bg-secondary-600 text-secondary-200 rounded transition-colors"
                      >
                        {copiedValue ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedValue ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="text-blue-400 font-mono text-sm">
                      <code>{jsonValue}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Location Guidelines</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      <span className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Line Location</span>
                    </div>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">Around line 161 in the document</p>
                  </div>
                  
                  <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Bucket Name</span>
                    </div>
                    <code className="text-xs text-secondary-600 dark:text-secondary-400">vpb_ui</code>
                  </div>
                  
                  <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      <span className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Value Status</span>
                    </div>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">Either missing (insert) or NULL (update)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Editing Interface Screenshot */}
            <div className="bg-white dark:bg-secondary-800/50 rounded-lg p-4 border border-secondary-200 dark:border-secondary-700 mb-4">
              <h4 className="font-medium text-secondary-700 dark:text-secondary-300 mb-3">Document Editing Interface</h4>
              <div className="relative group cursor-pointer">
                <img 
                  src="/Assets/image-2025-2-13_23-49-36.png" 
                  alt="Couchbase document editing interface showing bucket selection and document view"
                  className="w-full h-40 object-cover rounded-lg border border-secondary-200 dark:border-secondary-600 shadow-sm group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setSelectedImage({
                    src: "/Assets/image-2025-2-13_23-49-36.png",
                    alt: "Couchbase document editing interface showing bucket selection and document view",
                    caption: "Document editing interface with bucket selection (vpb_ui)"
                  })}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
                    Click to enlarge
                  </div>
                </div>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                Document editing interface with bucket selection (vpb_ui)
              </p>
            </div>

            {/* Document Before/After Examples */}
            <div className="space-y-6 mb-4">
              {/* Document Before */}
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Document Before (Missing Value)</h4>
                <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">
                  The value should be around line 161. It will either be missing (insert it) or set to NULL (update it).
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-secondary-800/50 rounded-lg p-3 border border-secondary-200 dark:border-secondary-700">
                    <div className="relative group cursor-pointer">
                      <img 
                        src="/Assets/image-2025-2-14_0-10-17.png" 
                        alt="Document JSON structure before edit - left side view"
                        className="w-full h-32 object-cover rounded border border-secondary-200 dark:border-secondary-600 group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setSelectedImage({
                          src: "/Assets/image-2025-2-14_0-10-17.png",
                          alt: "Document JSON structure before edit - left side view",
                          caption: "Document JSON - Left side view"
                        })}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded transition-colors duration-200 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                      Document JSON - Left side view
                    </p>
                  </div>
                  <div className="bg-white dark:bg-secondary-800/50 rounded-lg p-3 border border-secondary-200 dark:border-secondary-700">
                    <div className="relative group cursor-pointer">
                      <img 
                        src="/Assets/image-2025-2-14_0-10-35.png" 
                        alt="Document JSON structure before edit - right side view"
                        className="w-full h-32 object-cover rounded border border-secondary-200 dark:border-secondary-600 group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setSelectedImage({
                          src: "/Assets/image-2025-2-14_0-10-35.png",
                          alt: "Document JSON structure before edit - right side view",
                          caption: "Document JSON - Right side view"
                        })}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded transition-colors duration-200 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                      Document JSON - Right side view
                    </p>
                  </div>
                </div>
              </div>

              {/* Document After */}
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Document After (Updated Value)</h4>
                <div className="bg-white dark:bg-secondary-800/50 rounded-lg p-4 border border-secondary-200 dark:border-secondary-700">
                  <div className="relative group cursor-pointer">
                    <img 
                      src="/Assets/image-2025-2-13_23-44-41.png" 
                      alt="Document JSON structure after adding hourly configuration value"
                      className="w-full h-40 object-cover rounded-lg border border-secondary-200 dark:border-secondary-600 shadow-sm group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => setSelectedImage({
                        src: "/Assets/image-2025-2-13_23-44-41.png",
                        alt: "Document JSON structure after adding hourly configuration value",
                        caption: "Document showing the updated hourly configuration value"
                      })}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-lg transition-colors duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-secondary-800/90 px-3 py-1 rounded-full text-xs font-medium">
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 text-center">
                    Document showing the updated hourly configuration value
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Final Steps
              </h4>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>1. Click <strong>Save</strong> after updating each document</li>
                <li>2. Repeat for both document IDs retrieved in Step 2</li>
                <li>3. Ask the operator to refresh their page before trying to update the journey</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
          Troubleshooting & Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Common Issues</h3>
            <ul className="space-y-2 text-sm text-secondary-700 dark:text-secondary-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Document not found: Verify journey ID is correct</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Access denied: Check Citrix connection and credentials</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Query returns no results: Check journey ID format</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-secondary-700 dark:text-secondary-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Always backup document before editing</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Verify JSON syntax before saving</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Test journey functionality after changes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal with Accessibility */}
      {selectedImage && createPortal(
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative max-w-6xl max-h-[95vh] bg-white dark:bg-secondary-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center justify-between">
                <h3 
                  id="modal-title" 
                  className="font-semibold text-lg text-secondary-900 dark:text-secondary-100 flex items-center"
                >
                  <Image className="w-6 h-6 mr-3 text-primary-600 dark:text-primary-400" />
                  {selectedImage.caption}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="p-3 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 
                           text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 
                           transition-all duration-200 group"
                  aria-label="Close image modal"
                >
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[70vh] object-contain mx-auto rounded-xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Press <kbd className="px-2 py-1 bg-secondary-100 dark:bg-secondary-700 rounded text-xs">ESC</kbd> or click outside to close
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default VPBCouchbaseDocumentRunbook;