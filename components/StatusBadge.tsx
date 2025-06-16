import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'auto_routed' | 'pending_review' | 'urgent' | 'failed' | 'success' | 'processing';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'auto_routed':
      case 'success':
        return {
          icon: CheckCircle,
          text: 'Auto Routed',
          variant: 'success' as const
        };
      case 'pending_review':
      case 'processing':
        return {
          icon: Clock,
          text: 'Pending Review',
          variant: 'warning' as const
        };
      case 'urgent':
        return {
          icon: AlertTriangle,
          text: 'Urgent',
          variant: 'destructive' as const
        };
      case 'failed':
        return {
          icon: XCircle,
          text: 'Failed',
          variant: 'secondary' as const
        };
      default:
        return {
          icon: Clock,
          text: status,
          variant: 'secondary' as const
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
};