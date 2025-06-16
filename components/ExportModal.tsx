import React, { useState } from 'react';
import { Download, Calendar, FileText, Mail, Phone, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
  includeEmails: boolean;
  includeCalls: boolean;
  includeDocuments: boolean;
  includeSystemLogs: boolean;
  includeAIReasoning: boolean;
  projectScope: 'all' | 'specific';
  selectedProjects: string[];
  customStartDate?: string;
  customEndDate?: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Array<{ id: string; name: string }>;
  onExport: (config: ExportConfig) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projects,
  onExport
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pdf',
    dateRange: 'month',
    includeEmails: true,
    includeCalls: true,
    includeDocuments: true,
    includeSystemLogs: false,
    includeAIReasoning: true,
    projectScope: 'all',
    selectedProjects: []
  });

  const [isExporting, setIsExporting] = useState(false);

  const updateConfig = (key: keyof ExportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleProject = (projectId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(config);
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    let size = 0;
    if (config.includeEmails) size += 2.5;
    if (config.includeCalls) size += 1.2;
    if (config.includeDocuments) size += 5.8;
    if (config.includeSystemLogs) size += 0.8;
    if (config.includeAIReasoning) size += 1.5;
    
    // Adjust based on date range
    const multiplier = {
      week: 0.1,
      month: 0.5,
      quarter: 1.5,
      year: 6,
      all: 12,
      custom: 1
    }[config.dateRange];
    
    return (size * multiplier).toFixed(1);
  };

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Professional formatted report with charts and summaries',
      icon: FileText,
      recommended: true
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Structured data with multiple sheets for analysis',
      icon: FileText,
      recommended: false
    },
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Raw data export for external analysis tools',
      icon: FileText,
      recommended: false
    },
    {
      id: 'json',
      name: 'JSON Export',
      description: 'Complete data export including AI metadata',
      icon: Settings,
      recommended: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Export Project Data & Compliance Reports</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Export Format */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportFormats.map(format => (
                <Card
                  key={format.id}
                  className={`cursor-pointer transition-all ${
                    config.format === format.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
                  }`}
                  onClick={() => updateConfig('format', format.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <format.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{format.name}</span>
                          {format.recommended && (
                            <Badge variant="success" className="text-xs">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={config.dateRange} onValueChange={(value) => updateConfig('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last 12 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {config.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">From</label>
                    <input
                      type="date"
                      value={config.customStartDate || ''}
                      onChange={(e) => updateConfig('customStartDate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">To</label>
                    <input
                      type="date"
                      value={config.customEndDate || ''}
                      onChange={(e) => updateConfig('customEndDate', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    />
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">Estimated Export Size</div>
                <div className="text-sm text-muted-foreground">{getEstimatedSize()} MB</div>
              </div>
            </CardContent>
          </Card>

          {/* Content Inclusion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Include Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeEmails}
                  onChange={(e) => updateConfig('includeEmails', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Email Communications</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeCalls}
                  onChange={(e) => updateConfig('includeCalls', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Call Transcripts</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeDocuments}
                  onChange={(e) => updateConfig('includeDocuments', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Project Documents</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeSystemLogs}
                  onChange={(e) => updateConfig('includeSystemLogs', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">System Logs</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeAIReasoning}
                  onChange={(e) => updateConfig('includeAIReasoning', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium">AI Decision Reasoning</span>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Project Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={config.projectScope} onValueChange={(value) => updateConfig('projectScope', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="specific">Specific Projects</SelectItem>
                </SelectContent>
              </Select>

              {config.projectScope === 'specific' && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select Projects:</div>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {projects.map(project => (
                      <label key={project.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.selectedProjects.includes(project.id)}
                          onChange={() => toggleProject(project.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{project.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.selectedProjects.length} of {projects.length} projects selected
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Export will include {config.includeEmails ? 'emails, ' : ''}
            {config.includeCalls ? 'calls, ' : ''}
            {config.includeDocuments ? 'documents, ' : ''}
            {config.includeSystemLogs ? 'system logs, ' : ''}
            {config.includeAIReasoning ? 'AI reasoning' : ''}
            {config.projectScope === 'specific' ? ` for ${config.selectedProjects.length} selected projects` : ' for all projects'}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};