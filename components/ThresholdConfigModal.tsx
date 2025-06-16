import React, { useState } from 'react';
import { Settings, Brain, Target, AlertTriangle, Save, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ThresholdConfig {
  autoRouteThreshold: number;
  humanReviewThreshold: number;
  manualSortThreshold: number;
  priorityKeywords: string[];
  urgentKeywords: string[];
  spamKeywords: string[];
  confidenceWeights: {
    subjectAnalysis: number;
    senderReputation: number;
    contentAnalysis: number;
    projectMatching: number;
  };
}

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ThresholdConfig;
  onSave: (config: ThresholdConfig) => void;
}

const DEFAULT_CONFIG: ThresholdConfig = {
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

export const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [editedConfig, setEditedConfig] = useState<ThresholdConfig>(config);
  const [newKeyword, setNewKeyword] = useState('');
  const [activeKeywordType, setActiveKeywordType] = useState<'priority' | 'urgent' | 'spam'>('priority');

  const handleThresholdChange = (key: keyof Pick<ThresholdConfig, 'autoRouteThreshold' | 'humanReviewThreshold' | 'manualSortThreshold'>, value: number) => {
    setEditedConfig(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, value))
    }));
  };

  const handleWeightChange = (key: keyof ThresholdConfig['confidenceWeights'], value: number) => {
    const newWeights = { ...editedConfig.confidenceWeights };
    newWeights[key] = Math.max(0, Math.min(100, value));
    
    // Ensure weights add up to 100
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    if (total !== 100) {
      const scale = 100 / total;
      Object.keys(newWeights).forEach(k => {
        newWeights[k as keyof typeof newWeights] = Math.round(newWeights[k as keyof typeof newWeights] * scale);
      });
    }
    
    setEditedConfig(prev => ({
      ...prev,
      confidenceWeights: newWeights
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const keywordArray = activeKeywordType === 'priority' ? 'priorityKeywords' :
                          activeKeywordType === 'urgent' ? 'urgentKeywords' : 'spamKeywords';
      
      setEditedConfig(prev => ({
        ...prev,
        [keywordArray]: [...prev[keywordArray], newKeyword.trim().toLowerCase()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (type: 'priority' | 'urgent' | 'spam', keyword: string) => {
    const keywordArray = type === 'priority' ? 'priorityKeywords' :
                        type === 'urgent' ? 'urgentKeywords' : 'spamKeywords';
    
    setEditedConfig(prev => ({
      ...prev,
      [keywordArray]: prev[keywordArray].filter(k => k !== keyword)
    }));
  };

  const resetToDefaults = () => {
    setEditedConfig(DEFAULT_CONFIG);
  };

  const handleSave = () => {
    onSave(editedConfig);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>AI Model Configuration & Thresholds</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Confidence Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Confidence Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Auto-Route Threshold
                    <Badge variant="success" className="ml-2">{editedConfig.autoRouteThreshold}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={editedConfig.autoRouteThreshold}
                    onChange={(e) => handleThresholdChange('autoRouteThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emails above this confidence level are automatically routed to project folders
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Human Review Threshold
                    <Badge variant="warning" className="ml-2">{editedConfig.humanReviewThreshold}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={editedConfig.humanReviewThreshold}
                    onChange={(e) => handleThresholdChange('humanReviewThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emails between this and auto-route threshold go to "Sort Me" folder
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Manual Sort Threshold
                    <Badge variant="destructive" className="ml-2">{editedConfig.manualSortThreshold}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    value={editedConfig.manualSortThreshold}
                    onChange={(e) => handleThresholdChange('manualSortThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emails below this threshold require manual classification
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">Processing Flow</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>≥{editedConfig.autoRouteThreshold}%: Auto-route to project folders</div>
                  <div>{editedConfig.humanReviewThreshold}%-{editedConfig.autoRouteThreshold-1}%: Send to "Sort Me" folder</div>
                  <div>&lt;{editedConfig.humanReviewThreshold}%: Flag for manual review</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidence Weights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Analysis Weights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject Analysis
                    <Badge variant="secondary" className="ml-2">{editedConfig.confidenceWeights.subjectAnalysis}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={editedConfig.confidenceWeights.subjectAnalysis}
                    onChange={(e) => handleWeightChange('subjectAnalysis', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sender Reputation
                    <Badge variant="secondary" className="ml-2">{editedConfig.confidenceWeights.senderReputation}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={editedConfig.confidenceWeights.senderReputation}
                    onChange={(e) => handleWeightChange('senderReputation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Content Analysis
                    <Badge variant="secondary" className="ml-2">{editedConfig.confidenceWeights.contentAnalysis}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={editedConfig.confidenceWeights.contentAnalysis}
                    onChange={(e) => handleWeightChange('contentAnalysis', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Project Matching
                    <Badge variant="secondary" className="ml-2">{editedConfig.confidenceWeights.projectMatching}%</Badge>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={editedConfig.confidenceWeights.projectMatching}
                    onChange={(e) => handleWeightChange('projectMatching', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">Total Weight</div>
                <div className="text-sm text-muted-foreground">
                  {Object.values(editedConfig.confidenceWeights).reduce((sum, weight) => sum + weight, 0)}% 
                  {Object.values(editedConfig.confidenceWeights).reduce((sum, weight) => sum + weight, 0) !== 100 && 
                    <span className="text-red-600 ml-1">(Auto-adjusted to 100%)</span>
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Keywords */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Keyword Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-2">
                <Button
                  variant={activeKeywordType === 'priority' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveKeywordType('priority')}
                >
                  Priority Keywords
                </Button>
                <Button
                  variant={activeKeywordType === 'urgent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveKeywordType('urgent')}
                >
                  Urgent Keywords
                </Button>
                <Button
                  variant={activeKeywordType === 'spam' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveKeywordType('spam')}
                >
                  Spam Keywords
                </Button>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={`Add new ${activeKeywordType} keyword...`}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                />
                <Button onClick={addKeyword} size="sm">
                  Add
                </Button>
              </div>

              <div className="space-y-4">
                {activeKeywordType === 'priority' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Priority Keywords ({editedConfig.priorityKeywords.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {editedConfig.priorityKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="warning"
                          className="cursor-pointer"
                          onClick={() => removeKeyword('priority', keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {activeKeywordType === 'urgent' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Urgent Keywords ({editedConfig.urgentKeywords.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {editedConfig.urgentKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => removeKeyword('urgent', keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {activeKeywordType === 'spam' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Spam Keywords ({editedConfig.spamKeywords.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {editedConfig.spamKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeKeyword('spam', keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-between">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};