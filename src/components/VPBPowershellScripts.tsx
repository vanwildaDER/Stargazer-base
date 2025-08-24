import React, { useState } from 'react';
import { Copy, CheckCircle, AlertTriangle, Terminal, Play, Shield, ChevronDown, ChevronUp, List, ExternalLink, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageDescription from './PageDescription';

interface PowerShellScript {
  id: string;
  title: string;
  description: string;
  script: string;
  riskLevel?: 'low' | 'medium' | 'high';
  category: string;
}

const VPBPowershellScripts: React.FC = () => {
  const { hasPermission } = useAuth();
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [expandedScripts, setExpandedScripts] = useState<string[]>([]);

  // Check if user has VPB_SCRIPTS permission
  if (!hasPermission('VPB_SCRIPTS')) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-300 mb-4">Access Restricted</h2>
          <p className="text-red-200 mb-2">
            You don't have permission to access PowerShell scripts.
          </p>
          <p className="text-sm text-red-300">
            Required permission: <code className="bg-red-800 px-2 py-1 rounded">VPB_SCRIPTS</code>
          </p>
          <div className="mt-6 text-xs text-red-400">
            Contact your system administrator for access to VPB scripting tools.
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = (script: string, scriptId: string) => {
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScript(scriptId);
      setTimeout(() => setCopiedScript(null), 2000);
    });
  };

  const toggleScriptExpansion = (scriptId: string) => {
    setExpandedScripts(prev => 
      prev.includes(scriptId) 
        ? prev.filter(id => id !== scriptId)
        : [...prev, scriptId]
    );
  };

  const getPreviewScript = (script: string) => {
    const lines = script.split('\n');
    return lines.length > 10 ? lines.slice(0, 10).join('\n') : script;
  };

  const scrollToScript = (scriptId: string) => {
    const element = document.getElementById(`script-${scriptId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const highlightPowerShell = (code: string) => {
    // Split into lines to process line by line to avoid overlapping replacements
    const lines = code.split('\n');
    return lines.map(line => {
      let highlightedLine = line;
      
      // Skip if line is already processed or empty
      if (!highlightedLine.trim()) return highlightedLine;
      
      // Comments (must be first to avoid processing inside comments)
      if (highlightedLine.trim().startsWith('#')) {
        return `<span style="color: #6A9955;">${highlightedLine}</span>`;
      }
      
      // Store strings temporarily to avoid processing content inside strings
      const stringPlaceholders: { [key: string]: string } = {};
      let placeholderIndex = 0;
      
      // Replace double quoted strings
      highlightedLine = highlightedLine.replace(/"([^"]*)"/g, (match) => {
        const placeholder = `__STRING_PLACEHOLDER_${placeholderIndex++}__`;
        stringPlaceholders[placeholder] = `<span style="color: #CE9178;">${match}</span>`;
        return placeholder;
      });
      
      // Replace single quoted strings
      highlightedLine = highlightedLine.replace(/'([^']*)'/g, (match) => {
        const placeholder = `__STRING_PLACEHOLDER_${placeholderIndex++}__`;
        stringPlaceholders[placeholder] = `<span style="color: #CE9178;">${match}</span>`;
        return placeholder;
      });
      
      // PowerShell cmdlets
      highlightedLine = highlightedLine.replace(/\b(Get-\w+|Set-\w+|New-\w+|Remove-\w+|Add-\w+|Start-\w+|Stop-\w+|Invoke-\w+|Write-\w+|Read-\w+|Test-\w+|Connect-\w+|Disconnect-\w+|Enable-\w+|Disable-\w+|ConvertTo-\w+|ConvertFrom-\w+)\b/g, '<span style="color: #DCDCAA;">$1</span>');
      
      // Keywords
      highlightedLine = highlightedLine.replace(/\b(function|param|if|else|elseif|while|for|foreach|try|catch|finally|return|break|continue)\b/g, '<span style="color: #C586C0;">$1</span>');
      
      // Variables
      highlightedLine = highlightedLine.replace(/\$(\w+)/g, '<span style="color: #9CDCFE;">$$1</span>');
      
      // Parameters
      highlightedLine = highlightedLine.replace(/(-\w+)\b/g, '<span style="color: #9CDCFE;">$1</span>');
      
      // Numbers
      highlightedLine = highlightedLine.replace(/\b(\d+)\b/g, '<span style="color: #B5CEA8;">$1</span>');
      
      // Boolean/null values
      highlightedLine = highlightedLine.replace(/\b(True|False|null)\b/g, '<span style="color: #569CD6;">$1</span>');
      
      // Restore strings
      Object.keys(stringPlaceholders).forEach(placeholder => {
        highlightedLine = highlightedLine.replace(placeholder, stringPlaceholders[placeholder]);
      });
      
      return highlightedLine;
    }).join('\n');
  };

  const scripts: PowerShellScript[] = [
    {
      id: 'feature-toggle-summary',
      title: 'Get VPB Feature Toggle Summary',
      description: 'Retrieves the feature toggle summary from a Service Fabric application and outputs it to the console with color-coded status.',
      category: 'Monitoring',
      riskLevel: 'low',
      script: `# Service Fabric Feature Toggle Summary Script
# This script retrieves the feature toggle summary from a Service Fabric application and outputs it to the console.

$instance = "VirtualPitBoss.SFApp"
#$instance = "VirtualPitBoss.DOS.SFApp"
#$instance = "VirtualPitBoss.Quickfire.SFApp"

$baseUrl = "http://localhost:19081/$instance/JourneyManagerService/v1/features"
$queryParams = "?PartitionKey=1&PartitionKind=Int64Range"
$maxRetries = 3
$retryDelayInSeconds = 5

function Invoke-WebRequestWithRetry {
    param (
        $Uri,
        $Method,
        $MaxRetries,
        $RetryDelayInSeconds
    )
    
    $attempt = 0
    while ($attempt -lt $MaxRetries) {
        try {
            $response = Invoke-WebRequest -Uri $Uri -Method $Method -UseBasicParsing
            return $response
        }
        catch {
            Write-Host -ForegroundColor Yellow "Attempt $attempt failed. Retrying in $RetryDelayInSeconds seconds..."
            Start-Sleep -Seconds $RetryDelayInSeconds
        }
        $attempt++
    }
    
    throw "Failed to complete web request after $MaxRetries attempts."
}

function Get-FeatureToggleSummary {
    $url = "$baseUrl$queryParams"
    $response = Invoke-WebRequestWithRetry -Uri $url -Method Get -MaxRetries $maxRetries -RetryDelayInSeconds $retryDelayInSeconds
    $jsonResponse = $response.Content | ConvertFrom-Json
    
    Write-Host "Feature Toggle Summary:"
    foreach ($feature in $jsonResponse.Features) {
        $color = if ($feature.Enabled) { "Green" } else { "Red" }
        Write-Host "\t$($feature.Name) - $($feature.Enabled)" -ForegroundColor $color
    }
}

# Execute the function to get the feature toggle summary and copy to clipboard
$response = Get-FeatureToggleSummary
$response | clip`
    },
    {
      id: 'kafka-query-configs',
      title: 'Get KafkaQuery Configs',
      description: 'Retrieves the KafkaQuery configurations enabled on VPB Journeys and copies the result to clipboard.',
      category: 'Configuration',
      riskLevel: 'low',
      script: `# Get the KafkaQuery configs enabled on VPB Journeys
$response = $null
$response = Invoke-RestMethod 'http://localhost:19081/VirtualPitBoss.SFApp/ConfigurationService/v1/configurations/kafkaQueryConfigs?PartitionKey=1&PartitionKind=Int64Range' -Method 'GET' -Headers $headers
$response | ConvertTo-Json | clip
#$response | ConvertTo-Json`
    },
    {
      id: 'sf-replica-status',
      title: 'Check SF Replica Status (Excluding Ready)',
      description: 'Checks Service Fabric replica status and identifies any replicas that are not in Ready state, with color-coded output.',
      category: 'Health Check',
      riskLevel: 'low',
      script: `# Check SF Replica Status - excluding Ready
# Define the application name
#$appName = "fabric:/VirtualPitBoss.SFApp"
$appName = "fabric:/VirtualPitBoss.DOS.SFApp"

# Connect to the Service Fabric cluster
#Connect-ServiceFabricCluster #-ConnectionEndpoint "YourClusterEndpoint"

# Get all services in the application
$services = Get-ServiceFabricService -ApplicationName $appName

# Initialize a flag to check if any bad replicas are found
$badReplicasFound = $false
# Initialize an array to store bad replica details
$badReplicas = @()

foreach ($service in $services) {
    # Get all partitions for the service
    $partitions = Get-ServiceFabricPartition -ServiceName $service.ServiceName
    
    foreach ($partition in $partitions) {
        # Get all replicas for the partition
        $replicas = Get-ServiceFabricReplica -PartitionId $partition.PartitionId
        
        foreach ($replica in $replicas) {
            # Check if the replica status is not "Ready"
            if ($replica.ReplicaStatus -ne "Ready") {
                $badReplicasFound = $true
                $nodeName = (Get-ServiceFabricNode -NodeName $replica.NodeName).NodeName
                $badReplicas += [PSCustomObject]@{
                    ServiceName = $service.ServiceName
                    PartitionId = $partition.PartitionId
                    ReplicaId = $replica.ReplicaId
                    ReplicaStatus = $replica.ReplicaStatus
                    NodeName = $nodeName
                }
            }
        }
    }
}

# Output the header and bad replica details if any bad replicas are found
if ($badReplicasFound) {
    # Check the application name and output the corresponding message
    if ($appName -eq "fabric:/VirtualPitBoss.SFApp") {
        Write-Host "************************" -ForegroundColor Yellow
        Write-Host "CHECKING ITS VPB INSTANCE" -ForegroundColor Cyan
        Write-Host "************************" -ForegroundColor Yellow
    }
    elseif ($appName -eq "fabric:/VirtualPitBoss.DOS.SFApp") {
        Write-Host "************************" -ForegroundColor Yellow
        Write-Host "CHECKING DOS VPB INSTANCE" -ForegroundColor Cyan
        Write-Host "************************" -ForegroundColor Yellow
    }
    
    Write-Host "************************" -ForegroundColor Yellow
    Write-Host "REPLICA STATUS" -ForegroundColor Yellow
    Write-Host "************************" -ForegroundColor Yellow
    
    foreach ($replica in $badReplicas) {
        $color = "White"
        if ($replica.ReplicaStatus -eq "Down") { $color = "Red" }
        elseif ($replica.ReplicaStatus -eq "InBuild") { $color = "DarkYellow" }
        
        Write-Host "Service: $($replica.ServiceName), Partition: $($replica.PartitionId), Replica: $($replica.ReplicaId), Status: $($replica.ReplicaStatus), Node: $($replica.NodeName)" -ForegroundColor $color
    }
}
else {
    # Check the application name and output the corresponding message
    if ($appName -eq "fabric:/VirtualPitBoss.SFApp") {
        Write-Host "************************" -ForegroundColor Yellow
        Write-Host "CHECKING ITS VPB INSTANCE" -ForegroundColor Cyan
        Write-Host "************************" -ForegroundColor Yellow
    }
    elseif ($appName -eq "fabric:/VirtualPitBoss.DOS.SFApp") {
        Write-Host "************************" -ForegroundColor Yellow
        Write-Host "CHECKING DOS VPB INSTANCE" -ForegroundColor Cyan
        Write-Host "************************" -ForegroundColor Yellow
    }
    
    Write-Host "************************" -ForegroundColor Yellow
    Write-Host "REPLICA STATUS" -ForegroundColor Yellow
    Write-Host "************************" -ForegroundColor Yellow
    Write-Host "No Bad Replica's found, All Replica's are healthy and in a READY state." -ForegroundColor Green
}

# Disconnect from the Service Fabric cluster
#Disconnect-ServiceFabricCluster`
    },
    {
      id: 'sf-replica-all-nodes',
      title: 'Check SF Replica Status (All Nodes)',
      description: 'Comprehensive Service Fabric replica status check across all nodes and services with detailed filtering options.',
      category: 'Health Check',
      riskLevel: 'low',
      script: `# Check SF Replica Status - Custom Services and Nodes
# Define the application name
$appName = "fabric:/VirtualPitBoss.SFApp"
#$appName = "fabric:/VirtualPitBoss.DOS.SFApp"

# Define the specific nodes and services to filter
$targetNodes = @("MGS5898", "MGS5899")
$targetServices = @("$appName/JourneyStateMachineActorServiceV2", "$appName/AccountActorService", "$appName/JourneyTemplateActorService")

# Define toggles
$AllnodesTargeted = 0
$SortbyNode = 0
$TargetallReplicasStatus = 1
$TargetallRoles = 1

# Define the specific replica statuses and roles to filter
$targetReplicaStatus = @("Ready", "InBuild", "Down", "Standby", "Invalid")
$targetRoles = @("Primary", "ActiveSecondary", "IdleSecondary", "None")

# Connect to the Service Fabric cluster
# Connect-ServiceFabricCluster #-ConnectionEndpoint "YourClusterEndpoint"

# Get all services in the application
$services = Get-ServiceFabricService -ApplicationName $appName

# Initialize an array to store replica details
$replicasDetails = @()

foreach ($service in $services) {
    # Filter by specific services
    if ($targetServices -notcontains $service.ServiceName) { continue }
    
    # Get all partitions for the service
    $partitions = Get-ServiceFabricPartition -ServiceName $service.ServiceName
    
    foreach ($partition in $partitions) {
        # Get all replicas for the partition
        $replicas = Get-ServiceFabricReplica -PartitionId $partition.PartitionId
        
        foreach ($replica in $replicas) {
            # If AllnodesTargeted is not set, filter by specific nodes
            if ($AllnodesTargeted -ne 1 -and $targetNodes -notcontains $replica.NodeName) { continue }
            
            # If TargetallReplicasStatus is not set, filter by specific replica statuses
            if ($TargetallReplicasStatus -ne 1 -and $targetReplicaStatus -notcontains $replica.ReplicaStatus) { continue }
            
            # If TargetallRoles is not set, filter by specific roles
            if ($TargetallRoles -ne 1 -and $targetRoles -notcontains $replica.ReplicaRole) { continue }
            
            $nodeName = (Get-ServiceFabricNode -NodeName $replica.NodeName).NodeName
            $replicasDetails += [PSCustomObject]@{
                ServiceName = $service.ServiceName
                PartitionId = $partition.PartitionId
                ReplicaId = $replica.ReplicaId
                ReplicaStatus = $replica.ReplicaStatus
                NodeName = $nodeName
                ReplicaRole = $replica.ReplicaRole
            }
        }
    }
}

# Sort the replica details based on the SortbyNode toggle
if ($SortbyNode -eq 1) {
    $sortedReplicasDetails = $replicasDetails | Sort-Object NodeName, @{Expression = { $_.ReplicaRole }; Ascending = $true }
}
else {
    $sortedReplicasDetails = $replicasDetails | Sort-Object ServiceName, @{Expression = { $_.ReplicaRole }; Ascending = $true }, NodeName
}

# Output results with color coding
foreach ($replica in $sortedReplicasDetails) {
    $color = "White"
    if ($replica.ReplicaStatus -eq "Down") { $color = "Red" }
    elseif ($replica.ReplicaStatus -eq "InBuild") { $color = "DarkYellow" }
    elseif ($replica.ReplicaRole -eq "ActiveSecondary") { $color = "DarkCyan" }
    elseif ($replica.ReplicaStatus -eq "Ready") { $color = "Green" }
    
    Write-Host "Service: $($replica.ServiceName), Partition: $($replica.PartitionId), Replica: $($replica.ReplicaId), Status: $($replica.ReplicaStatus), Node: $($replica.NodeName), Role: $($replica.ReplicaRole)" -ForegroundColor $color
}`
    },
    {
      id: 'restart-analytics-distributor',
      title: 'Restart AnalyticsDistributor Service',
      description: 'Terminates and restarts the AnalyticsDistributor service on all DOS VPB nodes to fix Event-Hub consumer issues.',
      category: 'Operations',
      riskLevel: 'medium',
      script: `# Restart AnalyticsDistributor Service on ALL DOS VPB Nodes
Connect-ServiceFabricCluster
Clear-Host

$ApplicationName = "fabric:/VirtualPitBoss.DOS.SFApp"
#$ApplicationName = "fabric:/VirtualPitBoss.SFApp"
$ProcessName = "VirtualPitBoss.AnalyticsDistributor.exe"

# Get VPB Nodes
$VPBNodes = Get-ServiceFabricNode | Where-Object {$_.NodeType -eq "DOSVPBNodes"} | Select-Object NodeName | Sort-Object NodeName

# Get ProcessIDs Before Restart from SF
$HostProcessResult = foreach ($v in $VPBNodes) {
    Get-ServiceFabricDeployedCodePackage -ApplicationName $ApplicationName -ServiceManifestName "VirtualPitBoss.AnalyticsDistributorPkg" -NodeName $v.NodeName.ToString() | Select-Object -ExpandProperty EntryPoint | Select @{N='HostName';E={$v.NodeName.ToString()}}, ProcessID
}

Write-Host "------------------------------------------"
Write-Host ""
Write-Host "Current ProcessID's from SF"
$HostProcessResult | Format-Table -AutoSize

# Get ProcessIDs From Nodes Directly Before Restart
$NodeProcessResult = foreach ($v in $VPBNodes) {
    Get-WmiObject -Class Win32_Process -ComputerName $v.NodeName.ToString() -Filter "name='VirtualPitBoss.AnalyticsDistributor.exe'" | Select @{N='NodeName';E="CSName"}, ProcessID
}

Write-Host "------------------------------------------"
Write-Host ""
Write-Host "Current ProcessID's directly from Nodes"
$NodeProcessResult | Format-Table -AutoSize

# Terminate VirtualPitBoss.AnalyticsDistributor.exe on each node
foreach ($v in $VPBNodes) {
    $Process = Get-WmiObject -Class Win32_Process -ComputerName $v.NodeName.ToString() -Filter "name='VirtualPitBoss.AnalyticsDistributor.exe'"
    Write-Host "Terminating AnalyticsDistributor on"$v.NodeName.ToString()""
    $processid = $Process.handle
    $returnval = $Process.terminate()
    
    if($returnval.returnvalue -eq 0) {
        write-host "The process $ProcessName ($processid) terminated successfully"
    }
    else {
        write-host "The process $ProcessName ($processid) termination failed"
    }
    
    Write-Host "...waiting 15 seconds before restarting next node "
    Write-Host ""
    Start-Sleep -Seconds 15
}

# Get ProcessIDs From SF After
$HostProcessResult = foreach ($v in $VPBNodes) {
    Get-ServiceFabricDeployedCodePackage -ApplicationName $ApplicationName -ServiceManifestName "VirtualPitBoss.AnalyticsDistributorPkg" -NodeName $v.NodeName.ToString() | Select-Object -ExpandProperty EntryPoint | Select @{N='HostName';E={$v.NodeName.ToString()}}, ProcessID
}

Write-Host "------------------------------------------"
Write-Host ""
Write-Host "New ProcessID's in SF"
$HostProcessResult | Format-Table -AutoSize

# Get ProcessIDs From Nodes Directly After
$NodeProcessResult = foreach ($v in $VPBNodes) {
    Get-WmiObject -Class Win32_Process -ComputerName $v.NodeName.ToString() -Filter "name='VirtualPitBoss.AnalyticsDistributor.exe'" | Select @{N='NodeName';E="CSName"}, ProcessID
}

Write-Host "------------------------------------------"
Write-Host ""
Write-Host "New ProcessID's directly from Nodes"
$NodeProcessResult | Format-Table -AutoSize`
    },
    {
      id: 'remove-jd-queues',
      title: 'Remove JourneyDefinition Queues with No Consumers',
      description: 'Removes JourneyDefinition queues from RabbitMQ cluster that have no active consumers to clean up unused resources.',
      category: 'Maintenance',
      riskLevel: 'medium',
      script: `# Remove JourneyDefinition queues With No Consumers
# Get a list of queues from the RabbitMQ management API
$username = "rabbitAdmin"
$password = "rabbitAdminPwd"
$rabbitHost = "pubsubvpb.mal.mgsops.com"

# Base64 encode the credentials
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($username):$($password)"))

# API URL for queues
$url = "http://" + $rabbitHost + ":15672/api/queues/%2f"

# Exchange name
$ExchangeName = "vpb-application-journeydefinition-data"

# Make the API request
$queues = Invoke-RestMethod -Uri $url -Method Get -Headers @{ Authorization = "Basic $base64AuthInfo" }

# Filter queues with zero consumers and belonging to the specified exchange
$queuesToRemove = $queues | Where-Object { $_.consumers -eq 0 -and $_.name.Contains($ExchangeName) }
$queuesToRemove | ForEach-Object { $_.name }

# Remove each queue
foreach ($queue in $queuesToRemove) {
    $queueName = $queue.name
    Write-Host "Removing queue: $queueName"
    $deleteUri = "http://" + $rabbitHost + ":15672/api/queues/%2F/" + $queueName;
    Invoke-RestMethod -Uri $deleteUri -Method Delete -Headers @{ Authorization = "Basic $base64AuthInfo" }
}

Write-Host "Queues with zero consumers removed from exchange $ExchangeName."`
    },
    {
      id: 'feature-toggle-control',
      title: 'Enable/Disable Feature Toggles',
      description: 'HIGH RISK - Enables or disables specific feature toggles in VPB Service Fabric applications. Requires careful configuration before execution.',
      category: 'Configuration',
      riskLevel: 'high',
      script: `# Enable / Disable VPB SF App Feature Toggle
# IMPORTANT: Confirm these variables before executing:
# $instance - Confirm the Instance you are executing against
# $shouldEnableToggle = 1 - 1 = ENABLE / 0 = DISABLE  
# $featureToggles - CONFIRM the feature toggle you are Disabling/Enabling

$instance = "VirtualPitBoss.SFApp"
#$instance = "VirtualPitBoss.DOS.SFApp"

$baseUrl = "http://localhost:19081/$instance/JourneyManagerService/v1/features"
$queryParams = "?PartitionKey=1&PartitionKind=Int64Range"
$maxRetries = 3
$retryDelayInSeconds = 5

$shouldEnableToggle = 1  # 1 = ENABLE / 0 = DISABLE
$featureToggles = @("EnableCouchbaseInMessageEnrichment")

function Invoke-WebRequestWithRetry {
    param (
        $Uri,
        $Method,
        $MaxRetries,
        $RetryDelayInSeconds
    )
    
    $attempt = 0
    while ($attempt -lt $MaxRetries) {
        try {
            $response = Invoke-WebRequest -Uri $Uri -Method $Method -UseBasicParsing
            return $response
        }
        catch {
            Write-Host -ForegroundColor Yellow "Attempt $attempt failed. Retrying in $RetryDelayInSeconds seconds..."
            Start-Sleep -Seconds $RetryDelayInSeconds
        }
        $attempt++
    }
    
    throw "Failed to complete web request after $MaxRetries attempts."
}

function Enable-FeatureToggle {
    param ($featureToggle)
    $url = "$baseUrl/Enable/$featureToggle$queryParams"
    $response = Invoke-WebRequestWithRetry -Uri $url -Method POST -MaxRetries $maxRetries -RetryDelayInSeconds $retryDelayInSeconds
    Write-Host -ForegroundColor Green "ENABLING $featureToggle : " $response.Content
}

function Disable-FeatureToggle {
    param ($featureToggle)
    $url = "$baseUrl/Disable/$featureToggle$queryParams"
    $response = Invoke-WebRequestWithRetry -Uri $url -Method POST -MaxRetries $maxRetries -RetryDelayInSeconds $retryDelayInSeconds
    Write-Host -ForegroundColor Red "DISABLING $featureToggle : " $response.Content
}

function Get-FeatureToggleSummary {
    $url = "$baseUrl$queryParams"
    $response = Invoke-WebRequestWithRetry -Uri $url -Method Get -MaxRetries $maxRetries -RetryDelayInSeconds $retryDelayInSeconds
    $jsonResponse = $response.Content | ConvertFrom-Json
    
    Write-Host "Feature Toggle Summary:"
    foreach ($feature in $jsonResponse.Features) {
        if ($featureToggles -contains $feature.Name) {
            $color = if ($feature.Enabled) { "Green" } else { "Red" }
            Write-Host "\t$($feature.Name) - $($feature.Enabled)" -ForegroundColor $color
        }
        else {
            Write-Host "\t$($feature.Name) - $($feature.Enabled)"
        }
    }
}

foreach ($featureToggle in $featureToggles) {
    if ($shouldEnableToggle) {
        Enable-FeatureToggle -featureToggle $featureToggle
    }
    else {
        Disable-FeatureToggle -featureToggle $featureToggle
    }
}

Get-FeatureToggleSummary`
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <Shield className="w-4 h-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Terminal className="w-4 h-4 text-green-500" />;
    }
  };

  const groupedScripts = scripts.reduce((acc, script) => {
    if (!acc[script.category]) {
      acc[script.category] = [];
    }
    acc[script.category].push(script);
    return acc;
  }, {} as Record<string, PowerShellScript[]>);

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="PowerShell Scripts Collection"
        description="<p>Comprehensive collection of <strong>PowerShell scripts</strong> for VPB (Virtual Pit Boss) operations and management. These scripts cover monitoring, configuration, health checks, and maintenance tasks.</p><p><strong>⚠️ Important:</strong> Review each script carefully before execution, especially high-risk scripts that can modify system configurations.</p>"
        codeExample={`# Example: Get Feature Toggle Summary
$instance = "VirtualPitBoss.SFApp"
$response = Get-FeatureToggleSummary`}
      />

      {/* Table of Contents */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <List className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Table of Contents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedScripts).map(([category, categoryScripts]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-600 pb-2">
                {category} ({categoryScripts.length})
              </h3>
              <div className="space-y-2">
                {categoryScripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => scrollToScript(script.id)}
                    className="flex items-center justify-between w-full p-3 text-left bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      {getRiskIcon(script.riskLevel || 'low')}
                      <span className="text-sm text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {script.title}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Script Categories */}
      {Object.entries(groupedScripts).map(([category, categoryScripts]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
            <Play className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
            {category} Scripts
          </h2>

          <div className="space-y-6">
            {categoryScripts.map((script) => (
              <div key={script.id} id={`script-${script.id}`} className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg scroll-mt-6">
                {/* Script Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                        {script.title}
                      </h3>
                      {script.riskLevel && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getRiskColor(script.riskLevel)}`}>
                          {getRiskIcon(script.riskLevel)}
                          <span className="capitalize">{script.riskLevel} Risk</span>
                        </div>
                      )}
                    </div>
                    <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                      {script.description}
                    </p>
                  </div>
                </div>

                {/* High Risk Warning */}
                {script.riskLevel === 'high' && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-800 dark:text-red-200">HIGH RISK SCRIPT</span>
                    </div>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Review all variables and configuration before executing. Incorrect usage can affect production systems.
                    </p>
                  </div>
                )}

                {/* Script Content */}
                <div className="relative">
                  <div className="bg-secondary-900 dark:bg-secondary-800 rounded-lg overflow-hidden">
                    {/* Script Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-secondary-800 dark:bg-secondary-700 border-b border-secondary-700 dark:border-secondary-600">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-secondary-300">PowerShell Script</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {script.script.split('\n').length > 10 && (
                          <button
                            onClick={() => toggleScriptExpansion(script.id)}
                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-secondary-600 hover:bg-secondary-500 text-secondary-200 rounded transition-colors"
                          >
                            {expandedScripts.includes(script.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            <span>{expandedScripts.includes(script.id) ? 'Collapse' : 'Expand'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => copyToClipboard(script.script, script.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-xs bg-secondary-700 hover:bg-secondary-600 text-secondary-200 rounded transition-colors"
                        >
                          {copiedScript === script.id ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedScript === script.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Script Body */}
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        <code 
                          dangerouslySetInnerHTML={{
                            __html: highlightPowerShell(
                              expandedScripts.includes(script.id) ? script.script : getPreviewScript(script.script)
                            )
                          }}
                        />
                        {!expandedScripts.includes(script.id) && script.script.split('\n').length > 10 && (
                          <div className="text-secondary-500 text-xs mt-2 italic">
                            ... {script.script.split('\n').length - 10} more lines (click Expand to view all)
                          </div>
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Usage Guidelines */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
          Usage Guidelines
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Before Execution</h3>
            <ul className="space-y-2 text-sm text-secondary-700 dark:text-secondary-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Review all script variables and configuration parameters</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Verify target instances (ITS vs DOS vs Quickfire)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Test in non-production environment first</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ensure proper Service Fabric cluster connectivity</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Risk Management</h3>
            <ul className="space-y-2 text-sm text-secondary-700 dark:text-secondary-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Low Risk:</strong> Read-only operations, status checks</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Medium Risk:</strong> Service restarts, queue cleanup</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>High Risk:</strong> Configuration changes, feature toggles</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPBPowershellScripts;