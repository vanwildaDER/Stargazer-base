import React, { useState, useMemo } from 'react';
import { Download, Send, Copy, CheckCircle, AlertCircle, ChevronDown, Image, X } from 'lucide-react';
import JSONPretty from 'react-json-pretty';
import { TokenService, OperatorType } from '../services/tokenService';

const GetAllJourneys: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorType>('ITS');
  const [tokenStatus, setTokenStatus] = useState<string>('No token');
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; caption: string } | null>(null);

  const updateTokenStatus = () => {
    const status = TokenService.getTokenStatus(selectedOperator);
    if (!status.hasToken) {
      setTokenStatus('No token');
    } else if (status.isExpired) {
      setTokenStatus('Token expired');
    } else {
      const minutes = Math.floor((status.expiresIn || 0) / (1000 * 60));
      const seconds = Math.floor(((status.expiresIn || 0) % (1000 * 60)) / 1000);
      setTokenStatus(`Cached (${minutes}m ${seconds}s)`);
    }
  };

  const handleOperatorChange = (operator: OperatorType) => {
    setSelectedOperator(operator);
    setError(null);
    updateTokenStatus();
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Get token for selected operator
      setTokenStatus('Fetching token...');
      const token = await TokenService.getToken(selectedOperator);
      updateTokenStatus();

      const vpbEndpoint = TokenService.getVpbEndpoint(selectedOperator);
      const response = await fetch(`${vpbEndpoint}/journeys/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`${selectedOperator} Journey Data:`, data);
      setResults(data);
    } catch (err) {
      console.error(`${selectedOperator} Journey Error:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`${selectedOperator} API Error: ${errorMessage}`);
      setTokenStatus('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!results) return;

    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_journeys_${selectedOperator}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyResults = async () => {
    if (!results) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          Get All Journey Definitions for Single Operator
        </h1>
        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
          This tool gets all journey definitions for the selected Operator. The tool calls a GET command to the VirtualPitBoss endpoint, and based on the Operator Token used in the call will only get that specific Operators detailed journey configurations and rules.
        </p>
        <div className="bg-secondary-100 dark:bg-secondary-700/50 rounded-lg p-3 border border-secondary-200 dark:border-secondary-600">
          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200">
            http://api3.mit.mgsops.com:7725/Account/VirtualPitBoss/v1/journeys/
          </code>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          WHAT IS A JOURNEY DEFINITION?
        </h3>
        <div className="text-secondary-700 dark:text-secondary-300 leading-relaxed space-y-4">
          <p>
            A journey definition is the configuration used by the VPB SF Application. It contains all the information, such as <strong>Initiating Triggers</strong>, <strong>Start Date</strong>, <strong>End Date</strong>, <strong>Event conditions</strong>, etc., all that is required to take a player on Journey. The configuration is in JSON format.
          </p>
          <p>
            Below are samples of how the Journey setup looks like in the H5 UI, where you can create a journey, so you can understand how it translates into the json config as also seen in the sample below. <strong>The tool in this page will get you live json data out of the SF App, via the VPB API.</strong>
          </p>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Image className="w-5 h-5 text-secondary-500" />
            <h4 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Visual Examples
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="relative group cursor-pointer"
                   onClick={(e) => {
                     e.preventDefault();
                     console.log('Image clicked!');
                     setSelectedImage({
                       src: "./Assets/JourneyDescription.png",
                       alt: "Journey Configuration UI",
                       caption: "H5 UI showing journey configuration parameters including triggers, dates, and player conditions"
                     });
                   }}>
                <img
                  src="./Assets/JourneyDescription.png"
                  alt="Journey Configuration UI"
                  className="w-full h-48 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700
                           transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg pointer-events-none" />
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                H5 UI showing journey configuration parameters including triggers, dates, and player conditions
              </p>
            </div>
            <div className="space-y-2">
              <div className="relative group cursor-pointer"
                   onClick={(e) => {
                     e.preventDefault();
                     console.log('Workflow image clicked!');
                     setSelectedImage({
                       src: "./Assets/JourneyWorkflow.png",
                       alt: "Journey Workflow Designer",
                       caption: "Visual workflow designer showing journey steps, branching logic, and event conditions"
                     });
                   }}>
                <img
                  src="./Assets/JourneyWorkflow.png"
                  alt="Journey Workflow Designer"
                  className="w-full h-48 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700
                           transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg pointer-events-none" />
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                Visual workflow designer showing journey steps, branching logic, and event conditions
              </p>
            </div>
            <div className="space-y-2">
              <div className="relative group cursor-pointer"
                   onClick={(e) => {
                     e.preventDefault();
                     console.log('JSON image clicked!');
                     setSelectedImage({
                       src: "./Assets/JourneyJSON.png",
                       alt: "Journey JSON Configuration", 
                       caption: "Live JSON data structure showing how the UI configuration translates to API format"
                     });
                   }}>
                <img
                  src="./Assets/JourneyJSON.png"
                  alt="Journey JSON Configuration"
                  className="w-full h-48 object-cover rounded-lg border border-secondary-200 dark:border-secondary-700
                           transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg pointer-events-none" />
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                Live JSON data structure showing how the UI configuration translates to API format
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Fetch All Journey Definitions
        </h2>
        
        {/* Operator Selection */}
        <div className="mb-6">
          <label htmlFor="operator-select" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Select Operator <span className="text-red-500">*</span>
          </label>
          <div className="relative w-48">
            <select
              id="operator-select"
              value={selectedOperator}
              onChange={(e) => handleOperatorChange(e.target.value as OperatorType)}
              className="w-full px-4 py-2 pr-8 border border-secondary-300 dark:border-secondary-600 rounded-lg
                         bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         appearance-none cursor-pointer"
            >
              <option value="ITS">ITS</option>
              <option value="Betway">Betway</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-500 pointer-events-none" />
          </div>
          <div className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
            Token Status: <span className="font-medium">{tokenStatus}</span>
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-400 
                       text-white font-medium rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       dark:focus:ring-offset-secondary-800 flex items-center space-x-3
                       disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{isLoading ? `Fetching All Journeys for ${selectedOperator}...` : `GET ALL JOURNEYS FOR ${selectedOperator}`}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300 font-medium">Error:</span>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        )}
      </div>

      {results && (
        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                        border border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              API Results ({selectedOperator})
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyResults}
                className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white 
                           font-medium rounded-lg transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2
                           dark:focus:ring-offset-secondary-800 flex items-center space-x-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white 
                           font-medium rounded-lg transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
                           dark:focus:ring-offset-secondary-800 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
          
          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>JSON Preview:</strong> Showing first 20,000 lines for performance. 
              Use Copy or Download buttons for complete dataset.
              <br />
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                Size: {((JSON.stringify(results).length) / (1024 * 1024)).toFixed(2)} MB • 
                Items: {Array.isArray(results) ? results.length : Object.keys(results).length} • 
                {JSON.stringify(results, null, 2).split('\n').length > 20000 ? 'Truncated for performance' : 'Complete data shown'}
              </div>
            </div>
          </div>
          
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <JsonHighlighter results={results} maxLength={20000} />
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-6xl max-h-[90vh] bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-2xl"
               onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{selectedImage.alt}</h3>
              <p className="text-white/80 text-sm">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// JSON syntax highlighter with proper colors
const JsonHighlighter: React.FC<{ results: any; maxLength: number }> = ({ results, maxLength }) => {
  const { displayData, isTruncated, totalLines } = useMemo(() => {
    const jsonString = JSON.stringify(results, null, 2);
    const lines = jsonString.split('\n');
    const totalLines = lines.length;
    
    if (lines.length <= maxLength) {
      return { displayData: results, isTruncated: false, totalLines };
    }
    
    // For truncation, we need to carefully reconstruct valid JSON from the truncated lines
    const truncatedLines = lines.slice(0, maxLength);
    
    // Add truncation info as a special property
    let truncatedData;
    if (Array.isArray(results)) {
      // For arrays, take first few complete items
      const itemsToShow = Math.min(10, results.length); // Show first 10 items max
      truncatedData = [
        ...results.slice(0, itemsToShow),
        {
          "__TRUNCATION_INFO__": `Showing first ${maxLength} lines out of ${totalLines} total lines`,
          "__TOTAL_ITEMS__": results.length,
          "__USE_DOWNLOAD__": "Use Download/Copy buttons for complete dataset"
        }
      ];
    } else {
      truncatedData = {
        ...results,
        "__TRUNCATION_INFO__": `Showing first ${maxLength} lines out of ${totalLines} total lines`,
        "__USE_DOWNLOAD__": "Use Download/Copy buttons for complete dataset"
      };
    }
    
    return { displayData: truncatedData, isTruncated: true, totalLines };
  }, [results, maxLength]);

  return (
    <div className="text-sm">
      <JSONPretty 
        data={displayData}
        theme={{
          main: 'line-height:1.4;color:#374151;background:transparent;overflow:auto;font-family:ui-monospace,SFMono-Regular,monospace;',
          error: 'line-height:1.4;color:#dc2626;background:transparent;',
          key: 'color:#2563eb;font-weight:600;',
          string: 'color:#059669;',
          value: 'color:#dc2626;font-weight:500;',
          boolean: 'color:#7c3aed;font-weight:500;',
          null: 'color:#7c3aed;font-weight:500;',
        }}
      />
      {isTruncated && (
        <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-xs text-orange-700 dark:text-orange-300">
          <strong>Data Truncation:</strong> Showing first {maxLength.toLocaleString()} lines out of {totalLines.toLocaleString()} total lines. 
          Use Copy or Download buttons for complete dataset.
        </div>
      )}
    </div>
  );
};

export default GetAllJourneys;