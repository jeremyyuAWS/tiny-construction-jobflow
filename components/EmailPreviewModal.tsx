import React from 'react';
import { Mail, Brain, Target, Clock, User, Paperclip, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ConfidenceBar } from './ConfidenceBar';
import { StatusBadge } from './StatusBadge';

interface EmailPreviewModalProps {
  email: {
    id: string;
    sender: string;
    subject: string;
    receivedAt: string;
    confidence: number;
    classification: string;
    projectName: string | null;
    priority: string;
    status: string;
    attachments: string[];
    snippet: string;
    fullBody: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ email, isOpen, onClose }) => {
  if (!email) return null;

  const getClassificationVariant = (classification: string) => {
    switch (classification) {
      case 'Bid': return 'success';
      case 'Enquiry': return 'info';
      case 'Spam': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAiReasoningSteps = (email: any) => {
    const steps = [];
    
    // Step 1: Content Analysis
    steps.push({
      title: "Content Analysis",
      description: "Analyzed email content for construction industry keywords and context",
      confidence: Math.min(email.confidence + 5, 100),
      details: [
        `Subject contains: "${email.subject.includes('RFP') ? 'RFP' : email.subject.includes('permit') ? 'permit' : email.subject.includes('violation') ? 'safety violation' : 'project-related'}" keywords`,
        `Sender domain: ${email.sender.includes('.gov') ? 'Government entity' : email.sender.includes('.com') ? 'Commercial entity' : 'Unknown domain'}`,
        `Body text contains ${email.fullBody.length} characters with construction terminology`
      ]
    });

    // Step 2: Classification Logic
    steps.push({
      title: "Classification Decision",
      description: "Applied machine learning model to determine email category",
      confidence: email.confidence,
      details: [
        `Primary indicators: ${email.classification === 'Bid' ? 'RFP keywords, budget mentions, proposal timeline' : 
          email.classification === 'Enquiry' ? 'Project updates, permit status, client communication' : 
          'Marketing language, unrelated content, promotional offers'}`,
        `Confidence threshold: ${email.confidence}% (${email.confidence >= 80 ? 'Auto-route' : email.confidence >= 60 ? 'Human review' : 'Manual sort'})`,
        `Project linkage: ${email.projectName ? `Matched to "${email.projectName}"` : 'No existing project match'}`
      ]
    });

    // Step 3: Priority Assessment
    steps.push({
      title: "Priority Assessment",
      description: "Evaluated urgency level based on content and sender",
      confidence: email.confidence - 5,
      details: [
        `Urgency keywords: ${email.priority === 'high' ? 'URGENT, violation, immediate action required' : 
          email.priority === 'medium' ? 'timeline, deadline, review required' : 'routine communication'}`,
        `Sender authority: ${email.sender.includes('.gov') ? 'Government - High priority' : 'Commercial - Standard priority'}`,
        `Response timeline: ${email.priority === 'high' ? 'Immediate (< 2 hours)' : email.priority === 'medium' ? 'Same day' : 'Standard (24-48 hours)'}`
      ]
    });

    // Step 4: Routing Decision
    steps.push({
      title: "Routing Decision",
      description: "Determined final destination based on classification and confidence",
      confidence: email.confidence,
      details: [
        `Target folder: ${email.classification === 'Bid' ? 'Bids & RFPs' : email.classification === 'Enquiry' ? email.projectName ? `Project: ${email.projectName}` : 'General Enquiries' : 'Spam/Marketing'}`,
        `Notification routing: ${email.priority === 'high' ? '#project-alerts channel + SMS' : email.priority === 'medium' ? '#general-updates channel' : 'Daily digest only'}`,
        `Action required: ${email.status === 'auto_routed' ? 'None - Automatically processed' : 'Manual review required'}`
      ]
    });

    return steps;
  };

  const aiSteps = getAiReasoningSteps(email);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>Email Analysis & Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Content */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">From:</span>
                    <span className="text-sm">{email.sender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Subject:</span>
                    <span className="text-sm font-medium">{email.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Received:</span>
                    <span className="text-sm">{formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}</span>
                  </div>
                  {email.projectName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Project:</span>
                      <Badge variant="info">{email.projectName}</Badge>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Classification Results</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getClassificationVariant(email.classification) as any}>
                      {email.classification}
                    </Badge>
                    <StatusBadge status={email.status as any} />
                  </div>
                  <ConfidenceBar confidence={email.confidence} />
                </div>

                {email.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attachments ({email.attachments.length})
                      </h4>
                      <div className="space-y-1">
                        {email.attachments.map((attachment, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center">
                            <span className="w-2 h-2 bg-muted rounded-full mr-2" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Email Body</h4>
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {email.fullBody}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Reasoning */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Decision Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSteps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {step.confidence}%
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground ml-8">
                        {step.description}
                      </p>
                      
                      <div className="ml-8 space-y-1">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="text-xs text-muted-foreground flex items-start">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                      
                      {index < aiSteps.length - 1 && (
                        <div className="ml-3 w-px h-4 bg-border" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View in Gmail
              </Button>
              <Button variant="outline" className="flex-1">
                <Target className="h-4 w-4 mr-2" />
                Reclassify
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};