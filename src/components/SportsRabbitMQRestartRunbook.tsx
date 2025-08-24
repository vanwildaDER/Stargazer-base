import React, { useState } from 'react';
import { AlertTriangle, Server, Database, Terminal, Copy, ExternalLink, CheckCircle, Clock, Users } from 'lucide-react';
import PageDescription from './PageDescription';

const SportsRabbitMQRestartRunbook: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string>('');

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const jsScript = `// Select all rows in the table
const rows = document.querySelectorAll('table tr');
// Extract only the numeric ID from the "Name" column (index 1)
const ids = Array.from(rows)
  .map(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 1) {
      const name = cells[1].textContent.trim();
      const match = name.match(/\\.(\\d+)$/); // Match digits at the end after a dot
      return match ? match[1] : null;
    }
    return null;
  })
  .filter(id => id !== null);
console.log(ids);`;

  const powershellScript = `# Define RabbitMQ Management API URL and credentials
$baseUrl = "http://astraftblveque.astra.mal.mgsops.com:15672/api/queues"
# Create a base64 encoded authorization header
$pair = "user:password"
$encodedAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{ Authorization = "Basic $encodedAuth" }
# Make the API call to get the queues
$response = Invoke-RestMethod -Uri $baseUrl -Headers $headers -Method Get
# Output the queue details for queues with more than 10 messages, sorted by number of messages in descending order
$response | Where-Object { $_.messages -gt 10 } | ForEach-Object {
  [PSCustomObject]@{
    Name = $_.name
    Messages = $_.messages
    Consumers = $_.consumers
    State = $_.state
  }
} | Sort-Object -Property Messages -Descending | Format-Table -AutoSize`;

  const generalEquivalenceTable = [
    { rabbitQueue: 'FixtureProcessor', component: 'Fixture' },
    { rabbitQueue: 'InPlay', component: 'InPlay' },
    { rabbitQueue: 'MarketManagement', component: 'MarketManagement' },
    { rabbitQueue: 'Scoreboard', component: 'Scoreboard' }
  ];

  const footballEquivalenceTable = [
    { rabbitQueue: 'Queue Astra.InPlay', windowsService: 'Astra FootballPreMatch Queue Processor', component: 'PreMatch' },
    { rabbitQueue: 'Astra FootballInPlay', windowsService: '', component: 'InPlay' },
    { rabbitQueue: 'Queue Astra.FixtureProcessor', windowsService: 'Astra.FootballFixtureProcessor', component: 'Fixture' },
    { rabbitQueue: 'Astra.PreMatchFixtureProcessor or Astra.FootballPreMatchFixtureProcessor', windowsService: '', component: 'PreMatchFP' },
    { rabbitQueue: 'Queue Astra.MarketManagement', windowsService: 'Astra.FootballInPlayMarketManagement', component: 'InPlayMarketManagement' },
    { rabbitQueue: 'Queue Astra.Scoreboard', windowsService: 'Astra FootballInPlay', component: 'InPlay' },
    { rabbitQueue: 'Queue Astra.Sheets', windowsService: 'Astra Football Sheet', component: 'FootballSheets' }
  ];

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="Trading - RabbitMQ Build Up - Restart Fixture Queue"
        description="This runbook provides simple steps to restart a Trading RabbitMQ fixture for any agent without experience to resolve most occurrences of RabbitMQ queue build-up alerts."
      />

      {/* Alert Details */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Alert Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-amber-800 dark:text-amber-200">Severity</span>
            </div>
            <span className="text-amber-700 dark:text-amber-300 font-bold">Medium</span>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-800 dark:text-red-200">Auto-Heal</span>
            </div>
            <span className="text-red-700 dark:text-red-300 font-bold">No</span>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-800 dark:text-blue-200">Escalation</span>
            </div>
            <span className="text-blue-700 dark:text-blue-300 font-bold">Football Developers → Software Operation</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Keywords:</h3>
          <div className="flex flex-wrap gap-2">
            {['RabbitMQ', 'Fixture Queue', 'Consumer Restart', 'Splunk Alert', 'Manual Restart Process'].map((keyword) => (
              <span key={keyword} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scope */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Scope</h2>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-700 dark:text-secondary-300">Restarting fixtures</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-700 dark:text-secondary-300">Addressing slow or stalled message consumption in RabbitMQ queues</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-secondary-700 dark:text-secondary-300">Handling stale messages and high queue volumes for specific fixtures</span>
          </li>
        </ul>
      </div>

      {/* Step-by-Step Procedure */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-6">Step-by-Step Procedure</h2>

        {/* Step 1 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="text-md font-semibold text-secondary-900 dark:text-secondary-100">Check Queue Value on Alert</h3>
          </div>
          <div className="ml-11 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-secondary-700 dark:text-secondary-300">
                <strong>If you see a fixture ID, use this documentation.</strong> Otherwise, seek help from a colleague experienced in this process.
              </p>
              <a href="https://confluence.derivco.co.za/pages/viewpage.action?pageId=1039926640" 
                 className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline mt-2">
                <ExternalLink className="w-4 h-4" />
                <span>Complete runbook for all situations</span>
              </a>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Special Case: Tennis</h4>
              <p className="text-secondary-700 dark:text-secondary-300 mb-3">
                Tennis queues often stop consuming because games are cancelled or traders stopped them.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                <li>Go to <strong>Astra → Tennis → BetGenius Tennis → Tennis monitor</strong></li>
                <li>Search for the Fixture - if "Restart" button shows, a trader stopped it (don't restart components)</li>
                <li>If fixture not found, check online if game is cancelled/over - if so, delete the queue in Rabbit</li>
                <li>For upcoming/live games (Stop button shows), proceed to step 2</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="text-md font-semibold text-secondary-900 dark:text-secondary-100">Retrieve Affected Fixture IDs</h3>
          </div>
          <div className="ml-11 space-y-4">
            <p className="text-secondary-700 dark:text-secondary-300">
              Go to the RabbitMQ web app of the affected sport:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Server className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                  <span className="font-medium">General</span>
                </div>
                <a href="http://astraqueue.astra.mal.mgsops.com:15672/#/queues" 
                   className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all">
                  astraqueue.astra.mal.mgsops.com:15672
                </a>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Server className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                  <span className="font-medium">Football</span>
                </div>
                <a href="http://astraftblveque.astra.mal.mgsops.com:15672/#/queues" 
                   className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all">
                  astraftblveque.astra.mal.mgsops.com:15672
                </a>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-secondary-700 dark:text-secondary-300">
                <li>Order table by "Messages ready" (decreasing)</li>
                <li>Note queues with ready messages over 10 that won't decrease after a few minutes</li>
                <li>Ignore queues with "Error" in the name</li>
              </ol>
            </div>

            {/* JavaScript Script */}
            <div className="bg-secondary-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-secondary-800">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm font-medium text-secondary-200">JavaScript - Extract IDs Script</span>
                </div>
                <button
                  onClick={() => copyToClipboard(jsScript, 'js-script')}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText === 'js-script' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-sm text-green-400 overflow-x-auto">
                <code>{jsScript}</code>
              </pre>
            </div>

            {/* PowerShell Script */}
            <div className="bg-secondary-900 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-secondary-800">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm font-medium text-secondary-200">PowerShell - Alternative Queue Check</span>
                </div>
                <button
                  onClick={() => copyToClipboard(powershellScript, 'ps-script')}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText === 'ps-script' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-sm text-blue-400 overflow-x-auto">
                <code>{powershellScript}</code>
              </pre>
              <div className="px-4 pb-4">
                <p className="text-xs text-secondary-400">
                  <strong>Note:</strong> Update the $pair variable with RabbitMQ username and password
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Equivalence Tables */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="text-md font-semibold text-secondary-900 dark:text-secondary-100">Get Component Name</h3>
          </div>
          <div className="ml-11 space-y-6">
            {/* General Equivalence Table */}
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">General Equivalence Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-secondary-800 rounded-lg overflow-hidden">
                  <thead className="bg-secondary-100 dark:bg-secondary-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Rabbit Queue Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Component Name for Script
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {generalEquivalenceTable.map((row, index) => (
                      <tr key={index} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                        <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100 font-mono">
                          {row.rabbitQueue}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100 font-mono">
                          {row.component}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Football Equivalence Table */}
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Football Equivalence Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-secondary-800 rounded-lg overflow-hidden">
                  <thead className="bg-secondary-100 dark:bg-secondary-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Rabbit Queue Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Windows Service
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-secondary-900 dark:text-secondary-100">
                        Component Name for Script
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                    {footballEquivalenceTable.map((row, index) => (
                      <tr key={index} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/50">
                        <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100 font-mono">
                          {row.rabbitQueue}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100 font-mono">
                          {row.windowsService}
                        </td>
                        <td className="px-4 py-3 text-sm text-secondary-900 dark:text-secondary-100 font-mono">
                          {row.component}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Football-Specific Instructions:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-secondary-700 dark:text-secondary-300">
                <li>If there are consumers, check the IP of the Channel to identify the service</li>
                <li>If no consumers, pick Component Name from equivalence table by Queue Name</li>
                <li>You might need a few tries to get it right since one Queue Name could reference many endpoints</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
            <h3 className="text-md font-semibold text-secondary-900 dark:text-secondary-100">Execute Restart Script</h3>
          </div>
          <div className="ml-11 space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-secondary-700 dark:text-secondary-300">
              <li>
                Download the RestartAnyRabbitMQQueue folder from the{' '}
                <a href="https://dev.azure.com/Derivco/Sports-ITSportsbook/_git/SourceControlledStuff?path=/Trading/PowerShell/RabbitMQ/RestartAnyRabbitMQQueue&version=GBmaster" 
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Azure DevOps Repository
                </a>
              </li>
              <li>Open main.ps1 with PowerShell-capable environment (e.g., Visual Studio Code with PowerShell add-on)</li>
              <li>Go to the end of the file and replace:</li>
            </ol>
            
            <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">$sport</span>
                  <p className="text-secondary-600 dark:text-secondary-400">Affected sport from alert</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">$component</span>
                  <p className="text-secondary-600 dark:text-secondary-400">Value from equivalence table</p>
                </div>
                <div>
                  <span className="font-medium text-secondary-900 dark:text-secondary-100">$affectedGames</span>
                  <p className="text-secondary-600 dark:text-secondary-400">All fixture IDs (comma-separated)</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">Common Failures:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-secondary-700 dark:text-secondary-300">
                <li>If script fails on Get-Content, ensure endpoints.json file is properly referenced on $json line</li>
                <li>If script runs but fails to locate fixture, you likely picked wrong Component Name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Links and References */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Related Links</h2>
        <div className="space-y-2">
          <a href="https://confluence.derivco.co.za/pages/viewpage.action?pageId=1039926640" 
             className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline">
            <ExternalLink className="w-4 h-4" />
            <span>RabbitMQ - Restarting On-Prem Components + Stuck Message Queues Troubleshooting (Complete)</span>
          </a>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            SME: Football Developers - MTS Support
          </p>
        </div>
      </div>
    </div>
  );
};

export default SportsRabbitMQRestartRunbook;