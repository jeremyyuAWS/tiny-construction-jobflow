import React from 'react';
import { Activity, TrendingUp, Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import workflowMetrics from '../data/workflow_metrics.json';

export const DashboardOverview: React.FC = () => {
  const { emailProcessing, callProcessing, slackNotifications, projectBinders } = workflowMetrics;

  const overviewCards = [
    {
      title: "Emails Processed Today",
      value: emailProcessing.today,
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      title: "Calls Transcribed",
      value: callProcessing.today,
      change: "+8%", 
      trend: "up",
      icon: Clock,
      color: "text-green-600"
    },
    {
      title: "Active Projects",
      value: projectBinders.activeProjects,
      change: "+2",
      trend: "up", 
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "System Accuracy",
      value: `${emailProcessing.accuracyRate}%`,
      change: "+0.3%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">{card.change}</span>
                  <span>from yesterday</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processing Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Auto-Routing</span>
                <Badge variant="success">{emailProcessing.autoRoutedPercentage}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Call Transcription Accuracy</span>
                <Badge variant="info">{callProcessing.transcriptionAccuracy}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Slack Delivery Rate</span>
                <Badge variant="success">{slackNotifications.deliveryRate}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Response Time</span>
                <Badge variant="secondary">{emailProcessing.processingTimeAvg}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Safety violation detected</p>
                  <p className="text-xs text-muted-foreground">Maple Street - 8 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New bid opportunity auto-routed</p>
                  <p className="text-xs text-muted-foreground">Downtown Seattle Office - 15 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Activity className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Project binder updated</p>
                  <p className="text-xs text-muted-foreground">Harbor View Condos - 22 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};