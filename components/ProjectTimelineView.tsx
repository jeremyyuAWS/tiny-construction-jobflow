import React, { useState } from 'react';
import { Calendar, Mail, Phone, FileText, Clock, User, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TimelineEvent {
  id: string;
  type: 'email' | 'call' | 'document' | 'milestone';
  timestamp: string;
  title: string;
  description: string;
  participants?: string[];
  classification?: string;
  priority?: string;
  status?: string;
  attachments?: string[];
  projectPhase?: string;
}

interface ProjectTimelineViewProps {
  projectName: string;
  events: TimelineEvent[];
}

export const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({
  projectName,
  events
}) => {
  const [viewMode, setViewMode] = useState<'chronological' | 'grouped'>('chronological');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = format(new Date(event.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'document': return FileText;
      case 'milestone': return Calendar;
      default: return Clock;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'email': return 'text-blue-600';
      case 'call': return 'text-green-600';
      case 'document': return 'text-purple-600';
      case 'milestone': return 'text-orange-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'email': return 'info';
      case 'call': return 'success';
      case 'document': return 'secondary';
      case 'milestone': return 'warning';
      default: return 'secondary';
    }
  };

  const toggleGroup = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  const renderEvent = (event: TimelineEvent, showDate: boolean = true) => {
    const Icon = getEventIcon(event.type);
    
    return (
      <Card key={event.id} className="bg-muted/30 hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center">
                <Icon className={`h-4 w-4 ${getEventColor(event.type)}`} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <Badge variant={getTypeVariant(event.type) as any} className="text-xs">
                    {event.type}
                  </Badge>
                  {event.priority && (
                    <Badge 
                      variant={event.priority === 'high' ? 'destructive' : event.priority === 'medium' ? 'warning' : 'secondary'} 
                      className="text-xs"
                    >
                      {event.priority}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {showDate ? format(new Date(event.timestamp), 'MMM d, HH:mm') : format(new Date(event.timestamp), 'HH:mm')}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
              
              {event.participants && event.participants.length > 0 && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <User className="h-3 w-3" />
                  <span>Participants: {event.participants.join(', ')}</span>
                </div>
              )}
              
              {event.attachments && event.attachments.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.attachments.map((attachment, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {attachment}
                    </Badge>
                  ))}
                </div>
              )}
              
              {event.projectPhase && (
                <div className="mt-2">
                  <Badge variant="info" className="text-xs">
                    Phase: {event.projectPhase}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{projectName} Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length} events • {Object.keys(groupedEvents).length} days
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="email">Emails Only</SelectItem>
              <SelectItem value="call">Calls Only</SelectItem>
              <SelectItem value="document">Documents Only</SelectItem>
              <SelectItem value="milestone">Milestones Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={viewMode} onValueChange={(value: 'chronological' | 'grouped') => setViewMode(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chronological">Chronological</SelectItem>
              <SelectItem value="grouped">Grouped by Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {viewMode === 'chronological' ? (
          // Chronological view
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {index > 0 && (
                  <div className="absolute left-4 -top-2 w-px h-4 bg-border" />
                )}
                {renderEvent(event)}
              </div>
            ))}
          </div>
        ) : (
          // Grouped by day view
          <div className="space-y-6">
            {Object.entries(groupedEvents).map(([date, dayEvents]) => {
              const isExpanded = expandedGroups.has(date);
              
              return (
                <div key={date} className="space-y-3">
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(date)}
                    className="flex items-center space-x-2 p-2 w-full justify-start bg-muted/50 hover:bg-muted"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {dayEvents.length} events
                    </Badge>
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-3">
                      {dayEvents.map(event => renderEvent(event, false))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {filteredEvents.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No events found for the selected filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};