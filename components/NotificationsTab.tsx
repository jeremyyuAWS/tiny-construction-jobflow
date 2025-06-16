import React, { useState } from 'react';
import { Bell, Slack, Mail, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InfoModal } from './InfoModal';
import { StatusBadge } from './StatusBadge';
import notificationData from '../data/notifications.json';

export const NotificationsTab: React.FC = () => {
  const [activeChannels, setActiveChannels] = useState(
    notificationData.slackChannels.reduce((acc, channel) => {
      acc[channel.id] = channel.active;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleChannel = (channelId: string) => {
    setActiveChannels(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent_call':
        return AlertTriangle;
      case 'new_bid':
        return CheckCircle;
      case 'pending_review':
        return Clock;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent_call':
        return 'text-red-600';
      case 'new_bid':
        return 'text-green-600';
      case 'pending_review':
        return 'text-yellow-600';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">Slack Notifications & Alerts</h1>
          <InfoModal title="Slack Notifications & Alert System">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Intelligent Alert Routing</h3>
                <p className="text-muted-foreground">
                  Our notification system automatically sends targeted alerts to specific Slack channels based on 
                  the type and urgency of classified emails and call transcripts, ensuring the right teams get 
                  the right information at the right time.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Channel-Based Routing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">#project-alerts:</span> Urgent calls, permit issues, safety concerns</li>
                  <li><span className="font-medium">#bids-and-rfps:</span> New opportunities, proposal deadlines</li>
                  <li><span className="font-medium">#general-updates:</span> Daily summaries, routine communications</li>
                  <li><span className="font-medium">#admin-alerts:</span> System notifications, processing errors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Value</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Real-time awareness of critical project issues</li>
                  <li>• Reduced response time for urgent communications</li>
                  <li>• Improved team coordination and information sharing</li>
                  <li>• Complete audit trail of notification delivery</li>
                </ul>
              </div>
            </div>
          </InfoModal>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {notificationData.recentAlerts.length} recent alerts
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Slack className="h-5 w-5 mr-2 text-purple-600" />
                Slack Channel Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationData.slackChannels.map((channel) => {
                const isActive = activeChannels[channel.id];
                
                return (
                  <Card key={channel.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium">{channel.name}</span>
                            <Badge variant={isActive ? 'success' : 'secondary'}>
                              {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Alert Types:</span> {channel.alertTypes.join(', ')}
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => toggleChannel(channel.id)}
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                        >
                          {isActive ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure Notification Rules
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">24</div>
                    <div className="text-sm text-muted-foreground">Alerts Sent Today</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">3</div>
                    <div className="text-sm text-muted-foreground">Urgent Alerts</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-muted-foreground">Delivery Rate</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Alert Activity</h2>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y max-h-96 overflow-y-auto">
                {notificationData.recentAlerts.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type);
                  
                  return (
                    <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <AlertIcon className={`h-5 w-5 mt-0.5 ${getAlertColor(alert.type)}`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">
                              {alert.channel}
                            </p>
                            <div className="flex items-center space-x-2">
                              <StatusBadge status={alert.status as any} />
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {alert.message}
                          </p>
                          
                          {alert.projectName && (
                            <p className="text-xs text-primary mt-1">
                              Project: {alert.projectName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email notifications enabled as fallback for all critical alerts</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};