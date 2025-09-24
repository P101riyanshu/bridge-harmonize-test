import React, { useState } from 'react';
import { MoreVertical, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '../enhanced/AnimatedCard';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  refreshable?: boolean;
  expandable?: boolean;
  onRefresh?: () => void;
  delay?: number;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  className,
  refreshable = false,
  expandable = false,
  onRefresh,
  delay = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <AnimatedCard 
      delay={delay} 
      className={`${className} ${isExpanded ? 'col-span-full row-span-2' : ''} transition-all duration-300`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          {refreshable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          )}
          
          {expandable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? 
                <Minimize2 className="h-4 w-4" /> : 
                <Maximize2 className="h-4 w-4" />
              }
            </Button>
          )}
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-10 animate-slideInDown">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-t-md">
                  Export
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-b-md text-red-600">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className={`p-4 transition-all duration-300 ${isExpanded ? 'h-96 overflow-y-auto' : ''}`}>
        {children}
      </div>
    </AnimatedCard>
  );
};