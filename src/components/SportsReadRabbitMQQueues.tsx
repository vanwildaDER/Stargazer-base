import React, { useState } from 'react';
import { Play, Copy, Database, AlertCircle, CheckCircle, Clock, Server, Activity, Users } from 'lucide-react';
import PageDescription from './PageDescription';

interface QueueResult {
  name: string;
  messages: number;
  consumers: number;
  state: string;
  vhost: string;
  node?: string;
  memory?: number;
}

interface ApiResponse {
  success: boolean;
  data?: QueueResult[];
  error?: string;
  errorDetails?: string;
  timestamp?: string;
}

const SportsReadRabbitMQQueues: React.FC = () => {
  const [rabbitHost, setRabbitHost] = useState(import.meta.env.VITE_RABBITMQ_HOST || 'astraftblveque.astra.mal.mgsops.com');
  const [port, setPort] = useState(import.meta.env.VITE_RABBITMQ_PORT || '15672');
  const [username, setUsername] = useState(import.meta.env.VITE_RABBITMQ_USERNAME || '');
  const [password, setPassword] = useState(import.meta.env.VITE_RABBITMQ_PASSWORD || '');
  const [minMessages, setMinMessages] = useState(10);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [copiedText, setCopiedText] = useState('');


  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setResponse({
        success: false,
        error: 'Username and password are required'
      });
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      // Create the RabbitMQ Management API URL
      const apiUrl = `http://${rabbitHost}:${port}/api/queues`;
      
      // Create basic auth header
      const credentials = btoa(`${username}:${password}`);
      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      };

      // Make the actual API call
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
        mode: 'cors' // Enable CORS
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Provide specific error descriptions based on status code
        switch (response.status) {
          case 401:
            errorMessage = 'Authentication failed - Check your username and password';
            break;
          case 403:
            errorMessage = 'Access denied - Your account may not have permission to access the RabbitMQ Management API';
            break;
          case 404:
            errorMessage = 'RabbitMQ Management API not found - Check the host and port settings';
            break;
          case 500:
            errorMessage = 'RabbitMQ server error - The management service may be experiencing issues';
            break;
          case 503:
            errorMessage = 'RabbitMQ service unavailable - The server may be overloaded or down';
            break;
          default:
            if (response.status >= 500) {
              errorMessage = `Server error (${response.status}) - RabbitMQ management service is having issues`;
            } else if (response.status >= 400) {
              errorMessage = `Client error (${response.status}) - ${response.statusText}`;
            }
        }
        
        throw new Error(errorMessage);
      }

      const queues: QueueResult[] = await response.json();
      
      // Filter queues based on message threshold
      const filteredQueues = queues.filter(q => q.messages >= minMessages);

      setResponse({
        success: true,
        data: filteredQueues,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      let errorDetails = '';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network connection failed';
        errorDetails = `Unable to connect to ${rabbitHost}:${port}. This could be due to:
        • CORS policy blocking the request (common in browsers)
        • Network connectivity issues
        • RabbitMQ management plugin not enabled
        • Firewall blocking the connection
        • Incorrect host or port configuration`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
        
        // Add helpful context for common error scenarios
        if (error.message.includes('Authentication failed')) {
          errorDetails = 'Double-check your RabbitMQ username and password. Make sure the account has management permissions.';
        } else if (error.message.includes('not found')) {
          errorDetails = 'Verify that the RabbitMQ management plugin is enabled and the URL is correct.';
        } else if (error.message.includes('CORS')) {
          errorDetails = 'This browser request is being blocked by CORS policy. Consider using the PowerShell script instead, or implement a backend proxy.';
        }
      }

      setResponse({
        success: false,
        error: errorMessage,
        errorDetails: errorDetails,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePowerShellScript = () => {
    return `# RabbitMQ Queue Reader Script
$rabbitUser = '${username || 'your_username'}'
$rabbitPW = '${password ? '***' : 'your_password'}'
$rabbitHost = '${rabbitHost}'
$rabbitPort = '${port}'
$minMessages = ${minMessages}

# Define RabbitMQ Management API URL and credentials
$baseUrl = "http://$rabbitHost:$rabbitPort/api/queues"

# Create a base64 encoded authorization header
$pair = "$rabbitUser:$rabbitPW"
$encodedAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{ Authorization = "Basic $encodedAuth" }

try {
    Write-Host "Connecting to RabbitMQ Management API..." -ForegroundColor Yellow
    Write-Host "URL: $baseUrl" -ForegroundColor Gray
    
    # Make the API call to get the queues
    $response = Invoke-RestMethod -Uri $baseUrl -Headers $headers -Method Get -TimeoutSec 30
    
    Write-Host "Successfully retrieved $($response.Count) total queues" -ForegroundColor Green
    
    # Filter and sort queues with more messages than threshold
    $filteredQueues = $response | Where-Object { $_.messages -gt $minMessages }
    
    if ($filteredQueues.Count -eq 0) {
        Write-Host "No queues found with more than $minMessages messages" -ForegroundColor Green
    } else {
        Write-Host "Found $($filteredQueues.Count) queues with more than $minMessages messages:" -ForegroundColor Yellow
        
        $filteredQueues | ForEach-Object {
            [PSCustomObject]@{
                Name      = $_.name
                Messages  = $_.messages
                Consumers = $_.consumers
                State     = $_.state
                VHost     = $_.vhost
                Node      = $_.node
                Memory_KB = [math]::Round($_.memory / 1024, 2)
            }
        } | Sort-Object -Property Messages -Descending | Format-Table -AutoSize
    }
    
    Write-Host "Script completed successfully" -ForegroundColor Green
    
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check your credentials, network connection, and RabbitMQ service status" -ForegroundColor Yellow
}`;
  };

  const formatBytes = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="Read RabbitMQ Queues"
        description="Sometimes RabbitMQ UI is too slow and you can't access the queues list, so here's a tool that calls the RabbitMQ API which returns the queues, consumers and the number of messages building up. Perfect for quick diagnostics during high-load situations."
        codeExample="http://astraftblveque.astra.mal.mgsops.com:15672/api/queues"
        images={[
          {
            src: "/api/placeholder/600/300",
            alt: "RabbitMQ Management Interface",
            caption: "Example of RabbitMQ Management UI showing queue details"
          }
        ]}
      />

      {/* Configuration Form */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center space-x-2">
          <Server className="w-5 h-5" />
          <span>RabbitMQ Configuration</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rabbitHost" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                RabbitMQ Host <span className="text-red-500">*</span>
              </label>
              <input
                id="rabbitHost"
                type="text"
                value={rabbitHost}
                onChange={(e) => setRabbitHost(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                          bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="astraftblveque.astra.mal.mgsops.com"
                required
              />
            </div>

            <div>
              <label htmlFor="port" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                id="port"
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                          bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="15672"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                          bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="Enter RabbitMQ username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                          bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-secondary-400 dark:placeholder-secondary-500"
                placeholder="Enter RabbitMQ password"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="minMessages" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Minimum Messages Threshold
            </label>
            <input
              id="minMessages"
              type="number"
              value={minMessages}
              onChange={(e) => setMinMessages(parseInt(e.target.value) || 0)}
              className="w-full md:w-48 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg
                        bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
            />
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              Only show queues with more than this many messages
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 
                        disabled:bg-secondary-400 disabled:cursor-not-allowed text-white font-medium rounded-lg 
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 
                        focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Fetching Queues...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Get Queue Status</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => copyToClipboard(generatePowerShellScript(), 'powershell')}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 
                        text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none 
                        focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedText === 'powershell' ? 'Copied!' : 'Copy PowerShell'}</span>
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Security Note:</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Store credentials securely in environment variables. Add to your <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env</code> file:
                </p>
                <div className="mt-2 bg-blue-100 dark:bg-blue-800/50 rounded p-2 font-mono text-xs">
                  <div>VITE_RABBITMQ_USERNAME=your_username</div>
                  <div>VITE_RABBITMQ_PASSWORD=your_password</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {response && (
        <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Queue Results</h2>
            {response.timestamp && (
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                - {new Date(response.timestamp).toLocaleString()}
              </span>
            )}
          </div>

          {response.success ? (
            response.data && response.data.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Found {response.data.length} queues with ≥{minMessages} messages</span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Messages</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {response.data.reduce((sum, queue) => sum + queue.messages, 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Total Consumers</span>
                    </div>
                    <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {response.data.reduce((sum, queue) => sum + queue.consumers, 0)}
                    </span>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Idle Queues</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      {response.data.filter(q => q.consumers === 0).length}
                    </span>
                  </div>
                </div>

                {/* Queue Table */}
                <div className="overflow-x-auto">
                  <table className="w-full bg-white dark:bg-secondary-800 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-secondary-50 dark:bg-secondary-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">Queue Name</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-secondary-900 dark:text-secondary-100">Messages</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-secondary-900 dark:text-secondary-100">Consumers</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-secondary-900 dark:text-secondary-100">State</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-secondary-900 dark:text-secondary-100">Memory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      {response.data
                        .sort((a, b) => b.messages - a.messages)
                        .map((queue, index) => (
                        <tr key={index} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                          <td className="px-4 py-3 text-sm font-mono text-secondary-900 dark:text-secondary-100">
                            {queue.name}
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              queue.messages > 100 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : queue.messages > 50
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {queue.messages.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              queue.consumers === 0 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {queue.consumers}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              queue.state === 'running' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}>
                              {queue.state}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-mono text-secondary-600 dark:text-secondary-400">
                            {queue.memory ? formatBytes(queue.memory) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  All Queues Healthy
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  No queues found with more than {minMessages} messages. All systems appear to be running normally.
                </p>
              </div>
            )
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 text-lg mb-2">
                    Connection Failed
                  </h3>
                  <p className="text-red-700 dark:text-red-300 font-medium mb-3">
                    {response.error}
                  </p>
                  
                  {response.errorDetails && (
                    <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                        Troubleshooting Steps:
                      </h4>
                      <div className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">
                        {response.errorDetails}
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Alternative Solution</span>
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300 text-sm mb-2">
                      If browser requests continue to fail due to CORS or network restrictions, 
                      use the PowerShell script instead:
                    </p>
                    <button
                      onClick={() => copyToClipboard(generatePowerShellScript(), 'powershell-fallback')}
                      className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 
                                text-white text-sm font-medium rounded transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedText === 'powershell-fallback' ? 'Copied!' : 'Copy PowerShell Script'}</span>
                    </button>
                  </div>

                  {response.timestamp && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-3">
                      Failed at: {new Date(response.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SportsReadRabbitMQQueues;