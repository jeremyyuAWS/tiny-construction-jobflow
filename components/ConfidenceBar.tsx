import React from 'react';
import { Progress } from './ui/progress';

interface ConfidenceBarProps {
  confidence: number;
  className?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence, className = '' }) => {
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Progress 
        value={confidence} 
        className="flex-1 h-2"
      />
      <span className="text-sm font-medium text-muted-foreground min-w-[70px]">
        {confidence}% {getConfidenceLabel(confidence)}
      </span>
    </div>
  );
};