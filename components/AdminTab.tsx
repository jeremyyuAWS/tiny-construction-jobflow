import React, { useState } from 'react';
import { Settings, Database, Key, Activity, Shield, Download, Zap, Globe, Users, Sliders } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InfoModal } from './InfoModal';
import { StatusBadge } from './StatusBadge';
import { ThresholdConfigModal } from './ThresholdConfigModal';
import { ExportModal } from './ExportModal';
import systemLogs from '../data/system_logs.json';
import projectData from '../data/leads.json';

const DEFAULT_THRESHOLD_CONFIG = {
  autoRouteThreshold: 80,
  humanReviewThreshold: 60,
  manualSortThreshold: 40,
  priorityKeywords: ['urgent', 'permit delay', 'code violation', 'safety issue', 'deadline', 'emergency'],
  urgentKeywords: ['URGENT', 'IMMEDIATE', 'CRITICAL', 'STOP WORK', 'VIOLATION', 'EMERGENCY'],
  spamKeywords: ['sale', 'discount', 'promotion', 'deal', 'offer', 'limited time'],
  confidenceWeights: {
    subjectAnalysis: 25,
    senderReputation: 20,
    contentAnalysis: 35,
    projectMatching: 20
  }
};

export const AdminTab: React.FC = () => {
  const [activeServices, setActiveServices] = useState({
    gmail: true,
    outlook: false,
    openphone: true,
    onedrive: true,
    slack: true
  });

  const [isThresholdConfigOpen, setIsThresholdConfigOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [thresholdConfig, setThresholdConfig] = useState(DEFAULT_THRESHOLD_CONFIG);

  const toggleService = (service: string) => {
    setActiveServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const integrationServices = [
    {
      id: 'gmail',
      name: 'Gmail API',
      icon: Globe,
      status: activeServices.gmail ? 'connected' : 'disconnected',
      description: 'Email classification and routing',
      lastSync: '2 minutes ago'
    },
    {
      id: 'outlook',
      name: 'Outlook Graph API',
      icon: Globe,
      status: activeServices.outlook ? 'connected' : 'disconnected',
      description: 'Enterprise email integration',
      lastSync: 'Not configured'
    },
    {
      id: 'openphone',
      name: 'OpenPhone API',
      icon: Globe,
      status: activeServices.openphone ? 'connected' : 'disconnected',
      description: 'Call recording and transcription',
      lastSync: '5 minutes ago'
    },
    {
      id: 'onedrive',
      name: 'OneDrive Storage',
      icon: Database,
      status: activeServices.onedrive ? 'connected' : 'disconnected',
      description: 'Document storage and organization',
      lastSync: '1 minute ago'
    },
    {
      id: 'slack',
      name: 'Slack Webhooks',
      icon: Zap,
      status: activeServices.slack ? 'connected' : 'disconnected',
      description: 'Team notifications and alerts',
      lastSync: 'Real-time'
    }
  ];

  const getLogLevelVariant = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'success';
      case 'INFO':
        return 'info';
      case 'WARN':
        return 'warning';
      case 'ERROR':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleExport = async (config: any) => {
    console.log('Exporting audit log with config:', config);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">System Administration</h1>
          <InfoModal title="System Administration Dashboard">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comprehensive System Control</h3>
                <p className="text-muted-foreground">
                  The admin dashboard provides complete oversight of all AI workflow automation components, 
                  allowing you to monitor performance, configure settings, and maintain audit trails for 
                  regulatory compliance.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Key Management Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Service Integration:</span> Connect and manage Gmail, Outlook, OpenPhone, OneDrive, and Slack</li>
                  <li><span className="font-medium">AI Model Configuration:</span> Adjust confidence thresholds and priority keywords</li>
                  <li><span className="font-medium">Real-time Monitoring:</span> Track system performance and processing status</li>
                  <li><span className="font-medium">Audit Logging:</span> Complete history of all AI decisions and routing actions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Security & Compliance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Data Encryption:</span> All communications encrypted in transit and at rest</li>
                  <li><span className="font-medium">Access Control:</span> Role-based permissions for different user types</li>
                  <li><span className="font-medium">Audit Trail:</span> Immutable log of all system activities and decisions</li>
                  <li><span className="font-medium">Compliance Reporting:</span> Export capabilities for regulatory requirements</li>
                </ul>
              </div>
            </div>
          </InfoModal>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setIsThresholdConfigOpen(true)}>
            <Sliders className="h-4 w-4 mr-2" />
            Configure AI Model
          </Button>
          
          <Button onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-primary" />
                Service Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrationServices.map((service) => {
                const Icon = service.icon;
                const isActive = activeServices[service.id as keyof typeof activeServices];
                
                return (
                  <Card key={service.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{service.name}</span>
                              <StatusBadge 
                                status={isActive ? 'success' : 'failed'} 
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <p className="text-xs text-muted-foreground">Last sync: {service.lastSync}</p>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => toggleService(service.id)}
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                        >
                          {isActive ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                AI Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Email Classification Thresholds</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Auto-route confidence:</span>
                      <span className="font-medium">≥{thresholdConfig.autoRouteThreshold}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Human review threshold:</span>
                      <span className="font-medium">{thresholdConfig.humanReviewThreshold}-{thresholdConfig.autoRouteThreshold-1}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manual sort required:</span>
                      <span className="font-medium">&lt;{thresholdConfig.humanReviewThreshold}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Priority Keywords ({thresholdConfig.priorityKeywords.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {thresholdConfig.priorityKeywords.slice(0, 5).map((keyword) => (
                      <Badge key={keyword} variant="warning">
                        {keyword}
                      </Badge>
                    ))}
                    {thresholdConfig.priorityKeywords.length > 5 && (
                      <Badge variant="secondary">
                        +{thresholdConfig.priorityKeywords.length - 5} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full" onClick={() => setIsThresholdConfigOpen(true)}>
                <Sliders className="h-4 w-4 mr-2" />
                Advanced Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                System Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {systemLogs.systemLogs.map((log) => (
                  <Card key={log.id} className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getLogLevelVariant(log.level) as any}>
                            {log.level}
                          </Badge>
                          <span className="text-sm font-medium">{log.service}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {log.duration}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground mb-1">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-600" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemLogs.performanceMetrics.systemUptime}</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{systemLogs.performanceMetrics.averageResponseTime}</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{systemLogs.performanceMetrics.memoryUsage}</div>
                    <div className="text-sm text-muted-foreground">Memory Usage</div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{systemLogs.performanceMetrics.activeConnections}</div>
                    <div className="text-sm text-muted-foreground">Active Connections</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Queue Status</div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Queued Tasks:</span>
                  <Badge variant={systemLogs.performanceMetrics.queuedTasks > 5 ? 'warning' : 'success'}>
                    {systemLogs.performanceMetrics.queuedTasks}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ThresholdConfigModal
        isOpen={isThresholdConfigOpen}
        onClose={() => setIsThresholdConfigOpen(false)}
        config={thresholdConfig}
        onSave={setThresholdConfig}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projectData.projects}
        onExport={handleExport}
      />
    </div>
  );
};