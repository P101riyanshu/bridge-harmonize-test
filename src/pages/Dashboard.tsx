import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  FileText,
  Settings,
  Plus,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { StatisticsCard } from '@/components/dashboard/StatisticsCard';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import { AdvancedSearch } from '@/components/enhanced/AdvancedSearch';
import { StatusTimeline } from '@/components/enhanced/StatusTimeline';
import { RealTimeNotifications } from '@/components/enhanced/RealTimeNotifications';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<Record<string, string[]>>({});
  const [dashboardData, setDashboardData] = useState({
    totalGrievances: 1247,
    activeGrievances: 89,
    resolvedToday: 23,
    averageResolutionTime: 4.2
  });

  // Mock data for timeline
  const grievanceTimeline = [
    {
      id: '1',
      title: 'Grievance Submitted',
      description: 'New grievance submitted by citizen',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2', 
      title: 'Under Review',
      description: 'Grievance assigned to department for review',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'In Progress',
      description: 'Department working on resolution',
      status: 'current' as const,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Resolution',
      description: 'Final resolution and closure',
      status: 'pending' as const
    }
  ];

  const searchFilters_config = [
    {
      key: 'status',
      label: 'Status',
      options: ['Pending', 'In Progress', 'Resolved', 'Rejected']
    },
    {
      key: 'department',
      label: 'Department', 
      options: ['Public Works', 'Health', 'Education', 'Transport']
    },
    {
      key: 'priority',
      label: 'Priority',
      options: ['High', 'Medium', 'Low', 'Urgent']
    }
  ];

  const handleSearch = (query: string, filters: Record<string, string[]>) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    console.log('Search:', query, filters);
  };

  const refreshWidget = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDashboardData(prev => ({
      ...prev,
      totalGrievances: prev.totalGrievances + Math.floor(Math.random() * 5),
      resolvedToday: prev.resolvedToday + Math.floor(Math.random() * 3)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Here's what's happening with your grievances today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <RealTimeNotifications />
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Grievance
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <AdvancedSearch
            onSearch={handleSearch}
            filters={searchFilters_config}
            placeholder="Search grievances, departments, or citizens..."
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticsCard
            title="Total Grievances"
            value={dashboardData.totalGrievances}
            icon={FileText}
            trend={12}
            color="blue"
            delay={0}
          />
          <StatisticsCard
            title="Active Cases"
            value={dashboardData.activeGrievances}
            icon={Clock}
            trend={-5}
            color="orange"
            delay={100}
          />
          <StatisticsCard
            title="Resolved Today"
            value={dashboardData.resolvedToday}
            icon={CheckCircle}
            trend={23}
            color="green"
            delay={200}
          />
          <StatisticsCard
            title="Avg. Resolution Time"
            value={`${dashboardData.averageResolutionTime} days`}
            icon={TrendingUp}
            trend={-15}
            color="purple"
            delay={300}
          />
        </div>

        {/* Dashboard Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities Widget */}
          <DashboardWidget
            title="Recent Activities"
            refreshable
            expandable
            onRefresh={refreshWidget}
            delay={400}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {[
                { action: 'New grievance submitted', time: '2 minutes ago', type: 'info' },
                { action: 'Grievance #GRV-001 resolved', time: '15 minutes ago', type: 'success' },
                { action: 'Department response overdue', time: '1 hour ago', type: 'warning' },
                { action: 'System maintenance completed', time: '2 hours ago', type: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover-lift">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Grievance Status Timeline */}
          <DashboardWidget
            title="Sample Grievance Progress"
            delay={500}
          >
            <StatusTimeline steps={grievanceTimeline} />
          </DashboardWidget>
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mock Chart Widget */}
          <DashboardWidget
            title="Grievances by Department"
            refreshable
            expandable
            onRefresh={refreshWidget}
            delay={600}
          >
            <div className="space-y-4">
              {[
                { dept: 'Public Works', count: 45, color: 'bg-blue-500' },
                { dept: 'Health', count: 32, color: 'bg-green-500' },
                { dept: 'Education', count: 28, color: 'bg-purple-500' },
                { dept: 'Transport', count: 18, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.dept}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / 45) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Quick Actions Widget */}
          <DashboardWidget
            title="Quick Actions"
            delay={700}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'New Grievance', icon: Plus, color: 'bg-blue-500' },
                { label: 'View All', icon: FileText, color: 'bg-green-500' },
                { label: 'Analytics', icon: BarChart3, color: 'bg-purple-500' },
                { label: 'Settings', icon: Settings, color: 'bg-orange-500' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-lg ${action.color} text-white hover:scale-105 transition-transform duration-200 flex flex-col items-center space-y-2`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </DashboardWidget>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;