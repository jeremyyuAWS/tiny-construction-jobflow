import React, { useState } from 'react';
import { Phone, Clock, User, Tag, PlayCircle, CheckSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { InfoModal } from './InfoModal';
import { ConfidenceBar } from './ConfidenceBar';
import callData from '../data/calls.json';

export const VoiceCallsTab: React.FC = () => {
  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  const calls = callData.calls;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getTagVariant = (tag: string) => {
    const variants = {
      'bid_opportunity': 'success',
      'site_visit_required': 'info',
      'commercial': 'secondary',
      'code_violation': 'destructive',
      'project_delay': 'warning',
      'electrical_issue': 'warning',
      'urgent': 'destructive',
      'wrong_number': 'secondary',
      'bridge_project': 'info'
    };
    return variants[tag as keyof typeof variants] || 'secondary';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold">Voice Call Processing</h1>
          <InfoModal title="Voice Call Processing Workflow">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Automated Call Processing</h3>
                <p className="text-muted-foreground">
                  Our AI system automatically transcribes and analyzes phone calls from iPhone and OpenPhone, 
                  identifying project information, urgency levels, and actionable items from conversations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Key Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Speaker Identification:</span> Distinguishes between different speakers in multi-party calls</li>
                  <li><span className="font-medium">Project Linking:</span> Automatically associates calls with relevant construction projects</li>
                  <li><span className="font-medium">Action Item Extraction:</span> Identifies and lists specific tasks and follow-ups</li>
                  <li><span className="font-medium">Urgency Detection:</span> Flags calls containing safety issues, permit problems, or deadlines</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Smart Tagging System</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium">Bid Opportunities:</span> New project inquiries and RFP discussions</li>
                  <li>• <span className="font-medium">Code Violations:</span> Regulatory compliance issues requiring immediate attention</li>
                  <li>• <span className="font-medium">Project Delays:</span> Timeline changes and scheduling conflicts</li>
                  <li>• <span className="font-medium">Client Communications:</span> Customer concerns and feedback</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Business Impact</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Never miss critical project information from phone calls</li>
                  <li>• Automatic documentation for audit trails and compliance</li>
                  <li>• Immediate escalation of urgent issues to appropriate teams</li>
                  <li>• Comprehensive project communication history</li>
                </ul>
              </div>
            </div>
          </InfoModal>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {calls.length} processed calls
        </div>
      </div>

      <div className="grid gap-6">
        {calls.map((call) => (
          <Card key={call.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className={`h-5 w-5 ${getUrgencyColor(call.urgency)}`} />
                    <h3 className="font-semibold text-xl">{call.caller}</h3>
                    {call.urgency === 'high' && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{call.duration}</span>
                    </div>
                    <span>{formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}</span>
                    {call.projectName && (
                      <span>
                        Project: <span className="font-medium text-primary">{call.projectName}</span>
                      </span>
                    )}
                  </div>
                  
                  <p className="text-foreground">{call.summary}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {call.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant={getTagVariant(tag) as any}
                        className="text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  
                  {call.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Action Items
                      </h4>
                      <ul className="space-y-1">
                        {call.actionItems.map((item, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {expandedCall === call.id ? 'Hide' : 'Show'} Full Transcript
                    </Button>
                  </div>
                  
                  {expandedCall === call.id && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-foreground mb-2">Full Transcription</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{call.transcription}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="ml-6 flex flex-col items-end space-y-3">
                  <div className="w-48">
                    <ConfidenceBar confidence={call.confidence} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};