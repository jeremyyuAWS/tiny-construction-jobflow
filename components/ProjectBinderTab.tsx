import React, { useState } from 'react';
import { FolderOpen, Mail, Phone, FileText, Calendar, ExternalLink, Users, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InfoModal } from './InfoModal';
import { ProjectTimelineView } from './ProjectTimelineView';
import { ExportModal } from './ExportModal';
import projectData from '../data/leads.json';
import callData from '../data/calls.json';

export const ProjectBinderTab: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const projects = projectData.projects;
  const emails = projectData.emails;
  const calls = callData.calls;

  const getProjectCommunications = (projectName: string) => {
    const projectEmails = emails.filter(email => email.projectName === projectName);
    const projectCalls = calls.filter(call => call.projectName === projectName);
    
    return {
      emails: projectEmails,
      calls: projectCalls,
      total: projectEmails.length + projectCalls.length
    };
  };

  const getProjectTimelineEvents = (projectName: string) => {
    const communications = getProjectCommunications(projectName);
    
    const events = [
      ...communications.emails.map(email => ({
        id: `email-${email.id}`,
        type: 'email' as const,
        timestamp: email.receivedAt,
        title: email.subject,
        description: email.snippet,
        participants: [email.sender],
        classification: email.classification,
        priority: email.priority,
        status: email.status,
        attachments: email.attachments,
        projectPhase: getProjectPhase(email.receivedAt)
      })),
      ...communications.calls.map(call => ({
        id: `call-${call.id}`,
        type: 'call' as const,
        timestamp: call.timestamp,
        title: `Call with ${call.caller}`,
        description: call.summary,
        participants: [call.caller],
        priority: call.urgency,
        attachments: [],
        projectPhase: getProjectPhase(call.timestamp)
      }))
    ];

    // Add project milestones based on project dates
    const project = projects.find(p => p.name === projectName);
    if (project) {
      events.push({
        id: `milestone-start-${project.id}`,
        type: 'milestone' as const,
        timestamp: project.startDate,
        title: 'Project Start',
        description: `${projectName} project officially began`,
        participants: [project.projectManager],
        projectPhase: 'Initiation'
      });

      if (project.status === 'completed' && project.endDate) {
        events.push({
          id: `milestone-end-${project.id}`,
          type: 'milestone' as const,
          timestamp: project.endDate,
          title: 'Project Completion',
          description: `${projectName} project successfully completed`,
          participants: [project.projectManager],
          projectPhase: 'Closure'
        });
      }
    }

    return events;
  };

  const getProjectPhase = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    
    if (daysDiff < 30) return 'Current';
    if (daysDiff < 90) return 'Previous Quarter';
    if (daysDiff < 180) return 'Mid-Project';
    return 'Early Project';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in_progress': return 'info';
      case 'bidding': return 'warning';
      case 'planning': return 'secondary';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseInt(amount.replace(/[$,]/g, '')));
  };

  const handleExport = async (config: any) => {
    console.log('Exporting project data with config:', config);
    // In a real app, this would trigger the actual export process
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">Project Communication Binders</h1>
          <InfoModal title="Project Communication Binders">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Centralized Project Documentation</h3>
                <p className="text-muted-foreground">
                  Project binders automatically aggregate all communications (emails, calls, documents) by project, 
                  creating comprehensive audit trails and making it easy to track project history and decisions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Key Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Timeline View:</span> Chronological organization of all project communications</li>
                  <li><span className="font-medium">Cross-Reference Linking:</span> Connect related emails, calls, and documents</li>
                  <li><span className="font-medium">Export Capability:</span> Generate comprehensive project communication reports</li>
                  <li><span className="font-medium">Search & Filter:</span> Quickly find specific conversations or document types</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Benefits</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Complete audit trail for regulatory compliance</li>
                  <li>• Quick access to project decision history</li>
                  <li>• Streamlined handoffs between team members</li>
                  <li>• Professional client communication summaries</li>
                </ul>
              </div>
            </div>
          </InfoModal>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Project Data
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {projects.length} projects
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Overview</h2>
          
          {projects.map((project) => {
            const communications = getProjectCommunications(project.name);
            
            return (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProject === project.id ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge variant={getStatusVariant(project.status) as any}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>Client: <span className="font-medium text-foreground">{project.client}</span></span>
                          <span>Value: <span className="font-medium text-green-600">{formatCurrency(project.value)}</span></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                          {project.endDate && (
                            <span className="ml-4">End: {new Date(project.endDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="text-xs">
                          <span>{project.description}</span>
                        </div>
                        <div className="text-xs">
                          <span>Project Manager: <span className="font-medium">{project.projectManager}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{communications.emails.length} emails</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{communications.calls.length} calls</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{communications.total} total</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last activity: {formatDistanceToNow(new Date(project.lastActivity), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Timeline</h2>
          
          {selectedProject ? (
            <Card>
              <CardContent className="p-6">
                {(() => {
                  const project = projects.find(p => p.id === selectedProject);
                  if (!project) return null;
                  
                  const timelineEvents = getProjectTimelineEvents(project.name);
                  
                  return (
                    <ProjectTimelineView
                      projectName={project.name}
                      events={timelineEvents}
                    />
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a project to view its communication timeline</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        onExport={handleExport}
      />
    </div>
  );
};