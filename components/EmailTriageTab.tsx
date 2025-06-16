import React, { useState, useMemo } from 'react';
import { Mail, Paperclip, ExternalLink, Eye, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InfoModal } from './InfoModal';
import { StatusBadge } from './StatusBadge';
import { ConfidenceBar } from './ConfidenceBar';
import { EmailPreviewModal } from './EmailPreviewModal';
import { AdvancedFilters } from './AdvancedFilters';
import { ThresholdConfigModal } from './ThresholdConfigModal';
import { ExportModal } from './ExportModal';
import emailData from '../data/leads.json';

interface FilterState {
  search: string;
  classification: string;
  confidence: string;
  priority: string;
  status: string;
  project: string;
  dateRange: string;
  sender: string;
}

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

export const EmailTriageTab: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThresholdConfigOpen, setIsThresholdConfigOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [thresholdConfig, setThresholdConfig] = useState(DEFAULT_THRESHOLD_CONFIG);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    classification: '',
    confidence: '',
    priority: '',
    status: '',
    project: '',
    dateRange: '',
    sender: ''
  });

  const emails = emailData.emails;
  const projects = emailData.projects;

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (!email.subject.toLowerCase().includes(searchTerm) &&
            !email.sender.toLowerCase().includes(searchTerm) &&
            !email.snippet.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      // Classification filter
      if (filters.classification && email.classification !== filters.classification) {
        return false;
      }

      // Confidence filter
      if (filters.confidence) {
        const confidence = email.confidence;
        switch (filters.confidence) {
          case 'high':
            if (confidence < 80) return false;
            break;
          case 'medium':
            if (confidence < 60 || confidence >= 80) return false;
            break;
          case 'low':
            if (confidence >= 60) return false;
            break;
        }
      }

      // Priority filter
      if (filters.priority && email.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status && email.status !== filters.status) {
        return false;
      }

      // Project filter
      if (filters.project && email.projectName !== filters.project) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const emailDate = new Date(email.receivedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - emailDate.getTime()) / (1000 * 3600 * 24);
        
        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 1) return false;
            break;
          case 'yesterday':
            if (daysDiff < 1 || daysDiff > 2) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
          case 'quarter':
            if (daysDiff > 90) return false;
            break;
        }
      }

      // Sender filter
      if (filters.sender) {
        switch (filters.sender) {
          case 'government':
            if (!email.sender.includes('.gov')) return false;
            break;
          case 'commercial':
            if (!email.sender.includes('.com')) return false;
            break;
          case 'consulting':
            if (!email.sender.toLowerCase().includes('consulting')) return false;
            break;
          case 'suppliers':
            if (!email.sender.toLowerCase().includes('supply')) return false;
            break;
        }
      }

      return true;
    });
  }, [emails, filters]);

  const getClassificationVariant = (classification: string) => {
    switch (classification) {
      case 'Bid': return 'success';
      case 'Enquiry': return 'info';
      case 'Spam': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email);
    setIsPreviewOpen(true);
  };

  const handleExport = async (config: any) => {
    console.log('Exporting with config:', config);
    // In a real app, this would trigger the actual export process
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">Email Triage</h1>
          <InfoModal title="Email Triage Workflow">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                <p className="text-muted-foreground">
                  Our AI-powered email triage system automatically classifies incoming emails from your Gmail and Outlook accounts, 
                  routing them to appropriate project folders based on content analysis and confidence scoring.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Classification Types</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium text-green-600">Bids:</span> RFPs, project proposals, and contract opportunities</li>
                  <li><span className="font-medium text-blue-600">Enquiries:</span> Client communications, permit updates, and project questions</li>
                  <li><span className="font-medium text-red-600">Spam:</span> Marketing emails and unrelated content</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Confidence Thresholds</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium text-green-600">80%+ (High):</span> Automatically routed to project folders</li>
                  <li><span className="font-medium text-yellow-600">60-80% (Medium):</span> Sent to "Sort Me" folder for review</li>
                  <li><span className="font-medium text-red-600">Below 60% (Low):</span> Flagged for manual human review</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Value</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Reduces email processing time by 75%</li>
                  <li>• Ensures no critical communications are missed</li>
                  <li>• Maintains organized project documentation</li>
                  <li>• Provides audit trail for all routing decisions</li>
                </ul>
              </div>
            </div>
          </InfoModal>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          
          <Button variant="outline" onClick={() => setIsThresholdConfigOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure Thresholds
          </Button>
        </div>
      </div>

      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={emails.length}
        filteredCount={filteredEmails.length}
        projects={projects}
      />

      <div className="grid gap-4">
        {filteredEmails.map((email) => (
          <Card key={email.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${
                      email.priority === 'high' ? 'text-red-600' : 
                      email.priority === 'medium' ? 'text-yellow-600' : 'text-muted-foreground'
                    }`} />
                    <h3 className="font-semibold text-lg">{email.subject}</h3>
                    <Badge variant={getClassificationVariant(email.classification) as any}>
                      {email.classification}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      From: <span className="font-medium text-foreground">{email.sender}</span>
                      {email.projectName && (
                        <span className="ml-4">
                          Project: <span className="font-medium text-primary">{email.projectName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-foreground">{email.snippet}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}
                      </span>
                      
                      {email.attachments.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Paperclip className="h-4 w-4" />
                          <span>{email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={() => handleEmailClick(email)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-3">
                  <StatusBadge status={email.status as any} />
                  <div className="w-48">
                    <ConfidenceBar confidence={email.confidence} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No emails match the current filters</p>
          </CardContent>
        </Card>
      )}

      <EmailPreviewModal
        email={selectedEmail}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      <ThresholdConfigModal
        isOpen={isThresholdConfigOpen}
        onClose={() => setIsThresholdConfigOpen(false)}
        config={thresholdConfig}
        onSave={setThresholdConfig}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        onExport={handleExport}
      />
    </div>
  );
};