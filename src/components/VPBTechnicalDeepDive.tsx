import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, Database, MessageSquare, Settings, Zap, AlertTriangle, CheckCircle, GitBranch, Server, Cpu, Lock, Users, Clock, BarChart3 } from 'lucide-react';
import PageDescription from './PageDescription';

interface ServiceSection {
  id: string;
  title: string;
  order: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  notes?: string[];
  questions?: string[];
  status: 'complete' | 'partial' | 'draft';
}

const VPBTechnicalDeepDive: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['message-enrichment']);
  const [selectedTab, setSelectedTab] = useState<'services' | 'architecture' | 'data-flow'>('services');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const services: ServiceSection[] = [
    {
      id: 'message-enrichment',
      title: 'Message Enrichment Service',
      order: 1,
      description: 'Single entry point into VPB system. Converts messages from source event systems to standard model, enriches with platform API data, and passes to Journey Coordinator via Pub/Sub.',
      features: [
        'EnsureOperatorIdEnrichmentStep - Fetches operatorId for productId',
        'EnsureGamingServerIdEnrichmentStep - Fetches gamingServerId', 
        'GamingServerCardIdEnrichmentStep - Creates gamingServerId_cardId concatenation',
        'UserSessionEnrichmentStep - Enriches with usersCurrency, language, productId',
        'AccountGetPersonal2EnrichmentStep - Calls Account API for personal data',
        'CustomerLinkingMessageEnrichmentStep - Gets customer details and linked accounts',
        'UserBalanceEnrichmentStep - Gets balance details for login/session end events',
        'CurrencyLevelingEnrichmentStep - Handles currency conversion and leveling',
        'UserGroupEnrichmentStep - Gets user groups from USS API',
        'DepositPredictionMessageEnrichmentStep - Adds prediction scoring if enabled'
      ],
      icon: <MessageSquare className="w-5 h-5" />,
      notes: [
        'PlayerType = 0 is a Real player',
        'Product configurations live in PackageRoot/Data/ProductConfigs.json',
        'Designed to take performance hit upfront with parallel API calls'
      ],
      questions: [
        'Why is there both IImpactLogger and IVpbLogger in the same repo?',
        'Why didn\'t we use enums for event type validation?',
        'What is IntegrationUserSegmentationRelativeUri used for?'
      ],
      status: 'complete'
    },
    {
      id: 'journey-coordinator',
      title: 'Journey Coordinator Service',
      order: 2,
      description: 'Central hub for message routing based on event type, filter criteria, and journey qualification. Manages journey definitions and tracks active journey actor instances.',
      features: [
        'CreateOrUpdateJourneyDefinition - CRUD operations on journey definitions',
        'GetJourneyDefinition - Retrieve journey by identifier',
        'GetActiveJourneys - Get all active journeys for operator',
        'TerminateActiveJourneys - Journey termination (big red button)',
        'PlacePlayerOnJourney - Force place player on journey',
        'RemovePlayerFromJourney - Trigger actor deletion',
        'ProcessEvent - Main entry point for enriched messages',
        'EnqueueActorDelete - Schedule actor deletion with reason',
        'MigrateActorsForUserAndCustomer - JIT migration support'
      ],
      icon: <GitBranch className="w-5 h-5" />,
      notes: [
        'Uses partition key low/high values in RabbitMQ exchanges',
        'Cannot dynamically scale without Message Enrichment awareness',
        'Locking within nested loops can cause transaction locks'
      ],
      questions: [
        'Why use partition key values in RMQ instead of normal queues?',
        'What was driving factor behind updated vs legacy processing pipeline?',
        'What are Journey Fields and actor guard delay dates?'
      ],
      status: 'complete'
    },
    {
      id: 'actor-state-machine',
      title: 'Actor State Machine',
      order: 3,
      description: 'The core VPB logic engine. Modern Turing machine that processes step logic and makes deterministic movements through journey state machine for player progression.',
      features: [
        'IngestCore - Main event evaluation against journey rules',
        'CreateJourneyInstance - Creates journey instance on SF tenant',
        'CreateJourneyStateMachine - Creates new actor on journey',
        'Ingest - Passes message event to actor instance',
        'FixAndIngest - Passes updated journey definition and event',
        'GetState - Retrieves actor state',
        'RegisterDeferredReminder - Loads reminder into RMQ queue',
        'Expression Grammar - Custom evaluation expressions with Antlr'
      ],
      icon: <Cpu className="w-5 h-5" />,
      notes: [
        '90% code duplication between ExpressionFactory and ExpressionContextFactory',
        'High cognitive load in IngestCore method',
        'Could leverage factories and strategies more elegantly with enums'
      ],
      questions: [
        'Why create DateTimeProvider class instead of built-in DateTime?',
        'What is JourneyInstanceId and is it used?',
        'Why only delete actor if journey is customer aware?'
      ],
      status: 'complete'
    },
    {
      id: 'action-worker',
      title: 'Action Worker Service',
      order: 4,
      description: 'Exit point of VPB system. Receives JSON action payload from actors and executes actions via various platform APIs and external integrations.',
      features: [
        'AwardCredits - Balance API admin balance updates (cash/bonus)',
        'AwardXmatchUpToY - Percentage deposit matches with thresholds',
        'LoyaltyUpdatePoints - Loyalty system point awards',
        'UserSegmentationAddUserToUserGroup - USS API v1 group management',
        'FreeGamesAddUserToFreeGame - Free Games API integration',
        'SendOperatorNotificationMessage - Communications API operator events',
        'SendRemoteContentMessage - Remote content messaging',
        'SendKafkaNotificationMessage - Kafka topic publishing',
        'AwardRandomPrizer - RandomPrizer API prize allocation',
        'SavePlayerAttributes - Couchbase cache via Persistence Worker',
        'PublishOperatorEvent - VPB Journey API operator events'
      ],
      icon: <Zap className="w-5 h-5" />,
      notes: [
        'Config-driven approach with ActionDescriptions.json',
        'Must keep FieldNames.cs in sync with config changes',
        'Workarounds needed for non-REST API integrations'
      ],
      questions: [
        'How to better sync C# code with JSON configuration?',
        'Could action pipeline be more generic?'
      ],
      status: 'complete'
    },
    {
      id: 'actor-deletion',
      title: 'Actor Deletion Service',
      order: 5,
      description: 'Fire-and-forget actor deletion service. Handles soft/hard deletes, early exits, and reminder cleanup with race condition considerations.',
      features: [
        'Soft Delete - Removes most state, keeps essentials for re-entry calculation',
        'Hard Delete - Complete state removal, prevents re-entry',
        'Early Exits - Journey-defined actions for both delete types',
        'Reminder Cleanup - Removes all actor reminders',
        'State Cleanup - Disk state removal and active journey list updates'
      ],
      icon: <Lock className="w-5 h-5" />,
      notes: [
        'Race condition: deletion runs async while new events may create actors',
        'Active journey list updated only after deletion completion',
        'Can cause players to miss re-qualification for journeys'
      ],
      questions: [
        'Why not let actor delete its own state instead of round-trip?',
        'How to mitigate race conditions in deletion flow?'
      ],
      status: 'complete'
    },
    {
      id: 'garbage-collection',
      title: 'Garbage Collection Service',
      order: 6,
      description: 'Background service to clean Service Fabric state files. Time-triggered cleanup of actors that can no longer progress.',
      features: [
        'ActorHasStateAndJourneyHasPassedResetDate - Cleanup failed reset reminders',
        'JourneyHasPassedEndDate - Remove actors on expired journeys',
        'UserHasPassedWaitTimeOnCurrentStepPrimaryEventAndThereAreNoUserLimits - Wait timeout cleanup',
        'UserIsNotOnJourneyAndJourneyIsExpired - Expired journey cleanup',
        'UserIsNotOnJourneyAndThereAreNoUserLimits - No limits cleanup',
        'UserIsOnJourneyLongerThanMaxDurationAndThereAreNoUserLimits - Duration limit cleanup'
      ],
      icon: <Settings className="w-5 h-5" />,
      notes: [
        'Runs as slow background process triggered by time',
        'Multiple diagnostic controller endpoints available',
        'Tracks passes, page numbers, and actor statistics'
      ],
      questions: [
        'Why not await the background task instead of fire-and-forget?',
        'Why is the lock never released in some scenarios?'
      ],
      status: 'complete'
    },
    {
      id: 'persistence-worker',
      title: 'Persistence Worker Service',
      order: 7,
      description: 'Handles data persistence operations to Couchbase and other storage systems.',
      features: ['Data persistence to Couchbase', 'Journey Exclusion Lists (JEL) data', 'Player attribute storage'],
      icon: <Database className="w-5 h-5" />,
      status: 'draft'
    },
    {
      id: 'journey-aggregation',
      title: 'Journey Aggregation Service',
      order: 8,
      description: 'Aggregates journey data for reporting and analytics purposes.',
      features: ['Journey data aggregation', 'Performance metrics calculation', 'Reporting data preparation'],
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'draft'
    },
    {
      id: 'analytics-distributor',
      title: 'Analytics Distributor Service',
      order: 9,
      description: 'Distributes analytics data to various consumption endpoints.',
      features: ['Analytics data distribution', 'Real-time metrics streaming', 'Data lake integration'],
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'draft'
    },
    {
      id: 'configuration-service',
      title: 'Configuration Service',
      order: 10,
      description: 'Centralized configuration management for VPB system.',
      features: ['Product configurations', 'Operator settings', 'Feature toggles', 'Environment configuration'],
      icon: <Settings className="w-5 h-5" />,
      status: 'draft'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'draft':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="VPB Technical Deep Dive & Architecture"
        description="<p>Comprehensive technical documentation of VPB.Next microservices architecture, based on <strong>Simon Headley's upskilling materials</strong>. This deep dive covers all 10 core services, their interactions, data flows, and implementation details.</p><p>Essential reading for developers, architects, and technical staff working on VPB.Next systems.</p>"
        codeExample="https://dev.azure.com/Derivco/Software/_git/Platform-VPB-Journey-SFApp"
      />

      {/* Tab Navigation */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden">
        <div className="flex border-b border-secondary-200 dark:border-secondary-700">
          {[
            { id: 'services', label: 'Microservices', icon: <Server className="w-4 h-4" /> },
            { id: 'architecture', label: 'Architecture', icon: <GitBranch className="w-4 h-4" /> },
            { id: 'data-flow', label: 'Data Flow', icon: <Database className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                selectedTab === tab.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-b-2 border-primary-500'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Services Tab */}
        {selectedTab === 'services' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                VPB.Next Microservices Architecture
              </h2>
              <p className="text-secondary-700 dark:text-secondary-300">
                VPB.Next consists of 10 core microservices running on Microsoft Service Fabric. 
                Click on each service below to explore its functionality, features, and technical details.
              </p>
            </div>

            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(service.id)}
                    className="w-full flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300">
                          {service.order}
                        </div>
                        {service.icon}
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">
                          {service.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(service.status)}
                        <span className="text-xs text-secondary-500 capitalize">{service.status}</span>
                      </div>
                    </div>
                    {expandedSections.includes(service.id) ? 
                      <ChevronDown className="w-5 h-5 text-secondary-400" /> : 
                      <ChevronRight className="w-5 h-5 text-secondary-400" />
                    }
                  </button>

                  {expandedSections.includes(service.id) && (
                    <div className="p-6 bg-white dark:bg-secondary-900/50">
                      <div className="space-y-6">
                        {/* Description */}
                        <div>
                          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Purpose</h4>
                          <p className="text-secondary-700 dark:text-secondary-300">{service.description}</p>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Key Features</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {service.notes && service.notes.length > 0 && (
                          <div>
                            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Implementation Notes</h4>
                            <div className="space-y-2">
                              {service.notes.map((note, index) => (
                                <div key={index} className="flex items-start space-x-2 text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <Code className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-blue-800 dark:text-blue-200">{note}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Questions */}
                        {service.questions && service.questions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-3">Open Questions</h4>
                            <div className="space-y-2">
                              {service.questions.map((question, index) => (
                                <div key={index} className="flex items-start space-x-2 text-sm p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-yellow-800 dark:text-yellow-200">{question}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {selectedTab === 'architecture' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  System Architecture Overview
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Data Flow</h3>
                    <div className="space-y-3">
                      {[
                        { step: 1, title: 'Event Ingestion', desc: 'Gaming events → Message Enrichment' },
                        { step: 2, title: 'Enrichment', desc: 'Parallel API calls for player data' },
                        { step: 3, title: 'Routing', desc: 'Journey Coordinator → Actor State Machine' },
                        { step: 4, title: 'Processing', desc: 'Business logic evaluation and progression' },
                        { step: 5, title: 'Actions', desc: 'Action Worker → Platform APIs' }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start space-x-3 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                          <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.step}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-secondary-100">{item.title}</p>
                            <p className="text-sm text-secondary-700 dark:text-secondary-300">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Key Design Patterns</h3>
                    <div className="space-y-3">
                      {[
                        { pattern: 'Event-Driven Architecture', desc: 'RabbitMQ for async message processing' },
                        { pattern: 'Actor Model', desc: 'Service Fabric actors for state management' },
                        { pattern: 'CQRS', desc: 'Separate read/write data models' },
                        { pattern: 'Microservices', desc: 'Independently deployable services' },
                        { pattern: 'State Machines', desc: 'Deterministic journey progression' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                          <GitBranch className="w-4 h-4 text-secondary-500 mt-1" />
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-secondary-100">{item.pattern}</p>
                            <p className="text-sm text-secondary-700 dark:text-secondary-300">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Technical Stack</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tech: 'Service Fabric', category: 'Platform' },
                    { tech: 'RabbitMQ', category: 'Messaging' },
                    { tech: 'Couchbase', category: 'Database' },
                    { tech: '.NET Core', category: 'Runtime' },
                    { tech: 'React/H5', category: 'Frontend' },
                    { tech: 'Kafka', category: 'Streaming' },
                    { tech: 'ANTLR', category: 'Grammar' },
                    { tech: 'Docker', category: 'Containers' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                      <p className="font-medium text-secondary-900 dark:text-secondary-100">{item.tech}</p>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400">{item.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Flow Tab */}
        {selectedTab === 'data-flow' && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                  Message Flow & Processing Pipeline
                </h2>
                
                <div className="space-y-6">
                  <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
                      Message Enrichment Pipeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'EnsureOperatorIdEnrichmentStep',
                        'EnsureGamingServerIdEnrichmentStep', 
                        'UserSessionEnrichmentStep',
                        'AccountGetPersonal2EnrichmentStep',
                        'CustomerLinkingMessageEnrichmentStep',
                        'UserBalanceEnrichmentStep',
                        'CurrencyLevelingEnrichmentStep',
                        'UserGroupEnrichmentStep'
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300">
                            {index + 1}
                          </div>
                          <span className="text-sm text-secondary-700 dark:text-secondary-300 font-mono">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
                        Actor Communication Flow
                      </h3>
                      <div className="space-y-3">
                        {[
                          'CreateJourneyInstance',
                          'CreateJourneyStateMachine',
                          'Ingest (event processing)',
                          'FixAndIngest (journey updates)',
                          'RegisterDeferredReminder'
                        ].map((method, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-secondary-50 dark:bg-secondary-800/50 rounded">
                            <Code className="w-4 h-4 text-secondary-500" />
                            <span className="text-sm text-secondary-700 dark:text-secondary-300 font-mono">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
                        Action Execution Types
                      </h3>
                      <div className="space-y-3">
                        {[
                          { action: 'AwardCredits', api: 'Balance API' },
                          { action: 'UserSegmentation', api: 'USS API v1' },
                          { action: 'FreeGames', api: 'Free Games API' },
                          { action: 'Communications', api: 'Communications API' },
                          { action: 'RandomPrizer', api: 'RandomPrizer API' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary-50 dark:bg-secondary-800/50 rounded">
                            <span className="text-sm text-secondary-900 dark:text-secondary-100 font-medium">{item.action}</span>
                            <span className="text-xs text-secondary-600 dark:text-secondary-400">{item.api}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Training Progress Tracker
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {services.filter(s => s.status === 'complete').length}
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">Complete Services</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {services.filter(s => s.status === 'partial').length}
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">Partial Services</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {services.filter(s => s.status === 'draft').length}
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200">Draft Services</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPBTechnicalDeepDive;