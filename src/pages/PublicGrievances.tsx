import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

interface PublicGrievance {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: { address: string; };
  createdAt: string;
  resolvedAt?: string;
  upvotes: number;
  downvotes: number;
  similar_count: number;
}

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  resolved: CheckCircle,
  rejected: XCircle,
};

const statusColors = {
  pending: 'bg-warning text-warning-foreground',
  in_progress: 'bg-primary text-primary-foreground',
  resolved: 'bg-success text-success-foreground',
  rejected: 'bg-destructive text-destructive-foreground',
};

const PublicGrievances: React.FC = () => {
  const [grievances, setGrievances] = useState<PublicGrievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setGrievances([
        {
          id: 'PUB-001',
          title: 'Broken Street Light on Main Road',
          description: 'Street light has been non-functional for 2 weeks causing safety concerns for pedestrians.',
          category: 'Infrastructure',
          department: 'Municipal Corporation',
          status: 'in_progress',
          priority: 'medium',
          location: { address: 'Main Road, Sector 15' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          upvotes: 23,
          downvotes: 2,
          similar_count: 8
        },
        {
          id: 'PUB-002',
          title: 'Water Logging During Monsoon',
          description: 'Severe water logging occurs every monsoon due to poor drainage system.',
          category: 'Drainage',
          department: 'Public Works',
          status: 'resolved',
          priority: 'high',
          location: { address: 'Colony Road, Block A' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
          resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          upvotes: 45,
          downvotes: 1,
          similar_count: 12
        },
        {
          id: 'PUB-003',
          title: 'Irregular Garbage Collection',
          description: 'Garbage collection is irregular leading to unhygienic conditions.',
          category: 'Sanitation',
          department: 'Waste Management',
          status: 'pending',
          priority: 'medium',
          location: { address: 'Green Park Society' },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          upvotes: 31,
          downvotes: 3,
          similar_count: 6
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || grievance.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || grievance.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedGrievances = [...filteredGrievances].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'similar':
        return b.similar_count - a.similar_count;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const GrievanceCard: React.FC<{ grievance: PublicGrievance }> = ({ grievance }) => {
    const StatusIcon = statusIcons[grievance.status];
    
    return (
      <Card className="hover:shadow-card transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{grievance.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ID: {grievance.id}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(grievance.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>
            <Badge className={statusColors[grievance.status]}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {grievance.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground mb-4 line-clamp-2">
            {grievance.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-medium">Category:</span>
              <span>{grievance.category}</span>
              <span className="font-medium">Department:</span>
              <span>{grievance.department}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{grievance.location.address}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ThumbsUp className="h-3 w-3" />
                    <span className="ml-1 text-xs">{grievance.upvotes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ThumbsDown className="h-3 w-3" />
                    <span className="ml-1 text-xs">{grievance.downvotes}</span>
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{grievance.similar_count} similar</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Public Grievances</h1>
        <p className="text-muted-foreground">
          View anonymized public grievances and their resolution status. Vote on similar issues to increase priority.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search public grievances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Drainage">Drainage</SelectItem>
              <SelectItem value="Sanitation">Sanitation</SelectItem>
              <SelectItem value="Traffic">Traffic</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="similar">Most Similar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedGrievances.length} public grievances
        </p>
      </div>

      {/* Grievance Cards */}
      <div className="space-y-4">
        {sortedGrievances.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm ? 'No grievances match your search criteria.' : 'No public grievances available.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedGrievances.map((grievance) => (
            <GrievanceCard key={grievance.id} grievance={grievance} />
          ))
        )}
      </div>
    </div>
  );
};

export default PublicGrievances;