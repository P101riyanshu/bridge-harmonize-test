import React from 'react';
import { Check, Clock, AlertCircle, XCircle } from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'error';
  timestamp?: Date;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ steps, className }) => {
  const getIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'current':
        return <Clock className="h-4 w-4 text-white" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-white" />;
      default:
        return <div className="h-2 w-2 bg-white rounded-full" />;
    }
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-300';
    }
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start space-x-4 relative">
          {/* Timeline line */}
          {index < steps.length - 1 && (
            <div className="absolute left-4 top-8 w-0.5 h-12 bg-slate-200 dark:bg-slate-700"></div>
          )}
          
          {/* Status icon */}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(step.status)} transition-all duration-500`}>
            {getIcon(step.status)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-medium ${
                step.status === 'completed' ? 'text-green-700 dark:text-green-400' :
                step.status === 'current' ? 'text-blue-700 dark:text-blue-400' :
                step.status === 'error' ? 'text-red-700 dark:text-red-400' :
                'text-slate-500 dark:text-slate-400'
              }`}>
                {step.title}
              </h4>
              {step.timestamp && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTimestamp(step.timestamp)}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};