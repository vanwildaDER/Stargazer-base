import React, { useState } from 'react';
import { Download, Send, Copy, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { TokenService, OperatorType } from '../services/tokenService';

const GetAllJourneys: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorType>('ITS');
  const [tokenStatus, setTokenStatus] = useState<string>('No token');

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
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setTokenStatus('Token error');
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
        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
          Get all journey definitions for single Operator. This tool calls a GET command to the 
          VirtualPitBoss <code className="bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded text-sm font-mono">
          http://api3.mit.mgsops.com:7725/Account/VirtualPitBoss/v1/journeys/
          </code> endpoint with a specific Journey GUID.
        </p>
        
        {/* Operator Selection */}
        <div className="mt-4">
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
      </div>

      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Fetch All Journey Definitions
        </h2>
        
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
              API Results
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
          
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-secondary-800 dark:text-secondary-200 whitespace-pre-wrap font-mono">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllJourneys;