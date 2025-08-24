import React, { useState } from 'react';
import { Download, Send, Copy, CheckCircle, AlertCircle, ChevronDown, Image, X, Users, Zap, Database, MessageSquare, BarChart3, Settings, Calendar } from 'lucide-react';
import PageDescription from './PageDescription';

const VPBNextOverview: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; caption: string } | null>(null);

  return (
    <div className="w-full p-6 space-y-6">
      <PageDescription
        title="VPB.Next Platform Overview"
        description="<p>VPB.Next is Derivco's comprehensive <strong>player engagement and journey management platform</strong> designed specifically for gaming and casino operations. This modern H5-based system replaced the legacy Silverlight VPB to address performance constraints and provide enhanced functionality.</p><p>This section provides comprehensive training on VPB.Next architecture, features, team structure, customer implementations, and operational processes.</p>"
        codeExample="http://api3.mit.mgsops.com:7725/Account/VirtualPitBoss/v1/journeys/"
      />

      {/* Key Features & Architecture */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          VPB.Next vs Legacy VPB
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Legacy VPB Issues</h3>
            <div className="space-y-2">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>High Casino database load</span>
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Silverlight dependency (deprecated)</span>
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Limited scalability</span>
              </div>
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Batch-oriented processing</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">VPB.Next Benefits</h3>
            <div className="space-y-2">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>90% reduction in Casino DB load</span>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Modern H5/React interface</span>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Horizontally scalable</span>
              </div>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Event-driven real-time processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          System Architecture Overview
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Core Components</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">H5 Web UI</p>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">React-based modern interface for journey design and management</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">Service Fabric Backend</p>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">Microservices architecture with journey execution engine</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">RabbitMQ</p>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">Message queuing for reliable event processing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-secondary-900 dark:text-secondary-100">Couchbase</p>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">NoSQL database for player data and journey definitions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Integration Points</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <span className="text-secondary-900 dark:text-secondary-100">Gaming Platform APIs</span>
                <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">Real-time</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <span className="text-secondary-900 dark:text-secondary-100">Communication Services</span>
                <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">Multi-channel</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <span className="text-secondary-900 dark:text-secondary-100">Analytics & Reporting</span>
                <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">Data Lake</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <span className="text-secondary-900 dark:text-secondary-100">External Systems</span>
                <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">CRM/Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Structure */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <Users className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Team Structure (17 People)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">5</div>
            <p className="font-medium text-secondary-900 dark:text-secondary-100">Frontend Devs</p>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">Chillisoft Contractors</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">H5 Web UI, React</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">6</div>
            <p className="font-medium text-secondary-900 dark:text-secondary-100">Backend Devs</p>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">Cross-skilled</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">Service Fabric, RabbitMQ, Couchbase</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">8</div>
            <p className="font-medium text-secondary-900 dark:text-secondary-100">QA Engineers</p>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">6 Functional + 2 Automation</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">Testing & CI/CD</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">3</div>
            <p className="font-medium text-secondary-900 dark:text-secondary-100">Business/PM</p>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">BA + PM + Service Owner</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">Requirements & Strategy</p>
          </div>
        </div>
      </div>

      {/* Customer Implementations */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Customer Implementations
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Live Production</h3>
            <div className="space-y-3">
              {[
                { name: 'ITS', platform: 'Caiman H5', status: 'Primary customer, full feature set', color: 'green' },
                { name: 'Butlers', platform: 'Caiman H5', status: 'Complete journey management', color: 'green' },
                { name: 'Goldfishka', platform: 'Caiman H5', status: 'Multi-market deployment', color: 'green' },
                { name: 'Osiris', platform: 'Caiman H5', status: 'Custom journey templates', color: 'green' }
              ].map((customer, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full bg-${customer.color}-500`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">{customer.name}</span>
                      <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">{customer.platform}</span>
                    </div>
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">{customer.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">Pipeline</h3>
            <div className="space-y-3">
              {[
                { name: 'Betway', platform: 'Caiman H5', status: 'Planning Phase', timeline: 'Q2-Q3 2024', color: 'yellow' },
                { name: 'DOS', platform: 'Caiman H5', status: 'Planning Phase', timeline: 'Q3-Q4 2024', color: 'yellow' }
              ].map((customer, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full bg-${customer.color}-500`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">{customer.name}</span>
                      <span className="text-xs bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded">{customer.platform}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm text-secondary-700 dark:text-secondary-300">{customer.status}</p>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">{customer.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Key Active Projects
        </h2>
        
        <div className="space-y-4">
          <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Kafka Integration</h3>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">In Progress</span>
            </div>
            <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">
              Moving away from NSF, EI Rabbit & Collectors to Kafka for more stable and reliable event processing.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Login Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Logout Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Deposits</span>
              </div>
            </div>
          </div>

          <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">KSQL Query Integration</h3>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Phase 1 Complete</span>
            </div>
            <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">
              Ability to use KSQL queries for journey setup, enabling deprecation of current CEP queries.
            </p>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              <span className="font-medium">Live Queries:</span> RealPlayerTotalBalanceReaches20Cents, 30Cents, 50Cents
            </div>
          </div>

          <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Stability Improvements</h3>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">Ongoing</span>
            </div>
            <p className="text-sm text-secondary-700 dark:text-secondary-300 mb-3">
              Performance optimization and system reliability improvements including state migration and monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Deferred Reminders</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Token Refresh Fix</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-secondary-700 dark:text-secondary-300">State Migration</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-secondary-700 dark:text-secondary-300">Partition Scaling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Analytics */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Data Pipeline & Analytics
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Data Volume Challenge</h3>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Original VPB.Next data ingestion <strong>crippled the SQL Server instance</strong> due to high volume, 
              requiring complete rearchitecture of the analytics pipeline.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Processing Steps</h3>
              <div className="space-y-2">
                {[
                  'Raw Data Collection via RabbitMQ',
                  'Player Registration Data Join',
                  'Currency Normalization to Euro',
                  'Event Classification & Aggregation',
                  'Data Validation & Truncation'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-300">
                      {index + 1}
                    </div>
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">Output Tables</h3>
              <div className="space-y-2">
                {[
                  'tb_VPB_Journey_Daily_Summary',
                  'tb_VPB_Awarded_FreeGameOffers', 
                  'tb_VPB_Comms_Fired',
                  'tb_VPB_Deposits_Filtered'
                ].map((table, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-700 dark:text-secondary-300 font-mono">{table}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Resources */}
      <div className="bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm rounded-xl p-6 
                      border border-secondary-200 dark:border-secondary-700 shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
          Additional Training Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Meeting Minutes</h3>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              Bi-weekly VPB.Next meetings covering stability updates, live incidents, and project delivery.
            </p>
          </div>
          
          <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Sample Payloads</h3>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              Real event payload examples: Deposit, OIE, Registration, Login, Kafka Query Results.
            </p>
          </div>
          
          <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <h3 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">Backlog Management</h3>
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              ITS VPB Backlog with active items, priorities, and delivery tracking.
            </p>
          </div>
        </div>
      </div>

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

export default VPBNextOverview;