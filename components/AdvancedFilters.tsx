import React, { useState } from 'react';
import { Filter, Calendar, Search, X, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  projects: Array<{ id: string; name: string }>;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  projects
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    // Convert "all" back to empty string to clear the filter
    const filterValue = value === 'all' ? '' : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  const clearFilter = (key: keyof FilterState) => {
    updateFilter(key, '');
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      classification: '',
      confidence: '',
      priority: '',
      status: '',
      project: '',
      dateRange: '',
      sender: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <Badge variant="info" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {filteredCount} of {totalCount} items
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Always visible: Search and quick filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search emails..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={() => clearFilter('search')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Select value={filters.classification || 'all'} onValueChange={(value) => updateFilter('classification', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="Bid">Bids</SelectItem>
              <SelectItem value="Enquiry">Enquiries</SelectItem>
              <SelectItem value="Spam">Spam</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority || 'all'} onValueChange={(value) => updateFilter('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="auto_routed">Auto Routed</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expandable advanced filters */}
        {isExpanded && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4 border-t">
            <Select value={filters.confidence || 'all'} onValueChange={(value) => updateFilter('confidence', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Confidence Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence Levels</SelectItem>
                <SelectItem value="high">High (80%+)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.project || 'all'} onValueChange={(value) => updateFilter('project', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.dateRange || 'all'} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sender || 'all'} onValueChange={(value) => updateFilter('sender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sender Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Senders</SelectItem>
                <SelectItem value="government">Government (.gov)</SelectItem>
                <SelectItem value="commercial">Commercial (.com)</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="suppliers">Suppliers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('search')} />
              </Badge>
            )}
            
            {filters.classification && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.classification}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('classification')} />
              </Badge>
            )}
            
            {filters.priority && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.priority} priority
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('priority')} />
              </Badge>
            )}
            
            {filters.status && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.status.replace('_', ' ')}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('status')} />
              </Badge>
            )}
            
            {filters.confidence && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.confidence} confidence
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('confidence')} />
              </Badge>
            )}
            
            {filters.project && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.project}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('project')} />
              </Badge>
            )}
            
            {filters.dateRange && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.dateRange}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('dateRange')} />
              </Badge>
            )}
            
            {filters.sender && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.sender}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('sender')} />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};