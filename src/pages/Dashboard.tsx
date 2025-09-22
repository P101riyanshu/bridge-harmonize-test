import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Plus,
  Eye,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalGrievances: number;
  pendingGrievances: number;
  resolvedGrievances: number;
  averageResolutionTime: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalGrievances: 0,
    pendingGrievances: 0,
    resolvedGrievances: 0,
    averageResolutionTime: 0,
  });
  const [recentGrievances, setRecentGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load recent grievances
      const grievancesResponse = await api.getGrievances({
        limit: 5,
        ...(user?.role === 'citizen' ? { citizenId: user.id } : {}),
      });

      if (grievancesResponse.success && grievancesResponse.data) {
        setRecentGrievances(grievancesResponse.data.grievances);
        
        // Calculate stats from the grievances
        const grievances = grievancesResponse.data.grievances;
        const pending = grievances.filter(g => g.status === 'pending').length;
        const resolved = grievances.filter(g => g.status === 'resolved').length;
        
        setStats({
          totalGrievances: grievances.length,
          pendingGrievances: pending,
          resolvedGrievances: resolved,
          averageResolutionTime: 3.5, // Mock data
        });
      }

      // For admins, load additional analytics
      if (user?.role === 'admin') {
        const analyticsResponse = await api.getAnalytics();
        if (analyticsResponse.success && analyticsResponse.data) {
          setStats(analyticsResponse.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
    color?: string;
  }> = ({ title, value, icon: Icon, description, color = "text-primary" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      in_progress: { color: 'bg-primary text-primary-foreground', label: 'In Progress' },
      resolved: { color: 'bg-success text-success-foreground', label: 'Resolved' },
      rejected: { color: 'bg-destructive text-destructive-foreground', label: 'Rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'citizen' 
              ? 'Track and manage your grievances' 
              : user?.role === 'admin'
              ? 'Monitor and manage all civic grievances'
              : 'Handle assigned grievances for your department'
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/submit">
            <Button className="gradient-primary shadow-primary">
              <Plus className="mr-2 h-4 w-4" />
              Submit New Grievance
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Grievances"
          value={stats.totalGrievances}
          icon={FileText}
          description="All time submissions"
        />
        <StatCard
          title="Pending"
          value={stats.pendingGrievances}
          icon={Clock}
          description="Awaiting action"
          color="text-warning"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedGrievances}
          icon={CheckCircle}
          description="Successfully resolved"
          color="text-success"
        />
        <StatCard
          title="Avg. Resolution"
          value={`${stats.averageResolutionTime} days`}
          icon={TrendingUp}
          description="Average time to resolve"
          color="text-primary"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/submit">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Grievance
              </Button>
            </Link>
            <Link to="/grievances">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                {user?.role === 'citizen' ? 'My Grievances' : 'All Grievances'}
              </Button>
            </Link>
            {(user?.role === 'admin' || user?.role === 'department') && (
              <>
                <Link to="/admin/grievances">
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Pending
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Grievances */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Grievances</CardTitle>
            <Link to="/grievances">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentGrievances.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No grievances found</p>
              <p className="text-sm">Submit your first grievance to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentGrievances.slice(0, 5).map((grievance) => (
                <div
                  key={grievance.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-card transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{grievance.title}</h4>
                      {getStatusBadge(grievance.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ID: {grievance.id.slice(0, 8)}</span>
                      <span>{grievance.category}</span>
                      <span>{grievance.department}</span>
                    </div>
                  </div>
                  <Link to={`/grievances/${grievance.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;