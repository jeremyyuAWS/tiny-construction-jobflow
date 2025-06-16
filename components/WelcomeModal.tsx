import React from 'react';
import { Sparkles, Mail, Phone, FolderOpen, Bell, Settings, Activity, ArrowRight, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTabSelect?: (tabId: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onTabSelect }) => {
  const tabFeatures = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Real-time insights into your AI workflow automation performance',
      features: [
        'System performance metrics',
        'Processing statistics',
        'Activity monitoring',
        'Health status indicators'
      ],
      benefits: 'Get instant visibility into how AI is streamlining your operations'
    },
    {
      id: 'email-triage',
      title: 'Email Triage',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'AI-powered email classification and intelligent routing',
      features: [
        'Automatic bid vs. enquiry classification',
        'Project linking and context matching',
        'Confidence scoring and validation',
        'Smart folder organization'
      ],
      benefits: 'Reduce email processing time by 75% while ensuring nothing important is missed'
    },
    {
      id: 'voice-calls',
      title: 'Voice Call Processing',
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Automated call transcription with intelligent analysis',
      features: [
        'Real-time speech-to-text conversion',
        'Speaker identification',
        'Action item extraction',
        'Urgency level detection'
      ],
      benefits: 'Never miss critical information from phone calls again'
    },
    {
      id: 'project-binder',
      title: 'Project Communication Binders',
      icon: FolderOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Centralized project documentation and timeline management',
      features: [
        'Automatic communication aggregation',
        'Timeline view of all interactions',
        'Cross-reference linking',
        'Export and reporting capabilities'
      ],
      benefits: 'Maintain complete audit trails and enable quick information retrieval'
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      icon: Bell,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Intelligent Slack alerts and team coordination',
      features: [
        'Channel-based routing rules',
        'Priority-based escalation',
        'Real-time delivery tracking',
        'Anti-fatigue algorithms'
      ],
      benefits: 'Ensure critical communications reach the right people at the right time'
    },
    {
      id: 'admin',
      title: 'System Administration',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      description: 'Complete system control and configuration management',
      features: [
        'AI model threshold configuration',
        'Service integration management',
        'Performance monitoring',
        'Audit log exports'
      ],
      benefits: 'Maintain full control over AI decisions and system behavior'
    }
  ];

  const handleGetStarted = (tabId: string) => {
    onTabSelect?.(tabId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/tinys-logo-square.png" 
                alt="JobFlow AI Logo" 
                className="h-8 w-8"
              />
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span>Welcome to JobFlow AI</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h2 className="text-3xl font-bold text-foreground">
              AI that routes, records, and responds
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transform your workflow with intelligent automation that handles email classification, 
              call transcription, project organization, and team notifications — all while you focus 
              on what matters most.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>75% faster email processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>100% call capture rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Complete audit trails</span>
              </div>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Explore Each Workflow Module</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tabFeatures.map((tab) => {
                const Icon = tab.icon;
                
                return (
                  <Card key={tab.id} className={`${tab.bgColor} ${tab.borderColor} hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-3 text-lg">
                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                          <Icon className={`h-5 w-5 ${tab.color}`} />
                        </div>
                        <span>{tab.title}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{tab.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {tab.features.map((feature, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-center">
                              <div className="w-1 h-1 bg-current rounded-full mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t border-white/50">
                        <p className="text-xs font-medium text-foreground">{tab.benefits}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleGetStarted(tab.id)}
                      >
                        Explore {tab.title}
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Getting Started</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <h4 className="font-medium">Connect Your Services</h4>
                <p className="text-sm text-muted-foreground">
                  Link Gmail, Slack, and phone systems in the Admin tab
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <h4 className="font-medium">Configure AI Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Set confidence thresholds and priority keywords
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <h4 className="font-medium">Watch AI Work</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor the dashboard as AI processes your communications
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            You can reopen this guide anytime from the Dashboard
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Explore Later
            </Button>
            <Button onClick={() => handleGetStarted('dashboard')}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};