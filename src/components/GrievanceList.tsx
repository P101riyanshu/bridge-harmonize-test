import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Grievance } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface GrievanceListProps {
  showAllGrievances?: boolean;
  onSelectGrievance?: (grievance: Grievance) => void;
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

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning-foreground',
  high: 'bg-destructive/20 text-destructive-foreground',
  urgent: 'bg-destructive text-destructive-foreground',
};

const GrievanceList: React.FC<GrievanceListProps> = ({ 
  showAllGrievances = false,
  onSelectGrievance 
}) => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadGrievances();
  }, [currentPage, statusFilter, categoryFilter, showAllGrievances]);

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (!showAllGrievances && user) {
        params.citizenId = user.id;
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      const response = await api.getGrievances(params);
      
      if (response.success && response.data) {
        setGrievances(response.data.grievances);
        setTotalPages(response.data.totalPages);
      } else {
        toast({
          title: "Error loading grievances",
          description: response.error || "Failed to load grievances",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredGrievances = grievances.filter(grievance =>
    grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const GrievanceCard: React.FC<{ grievance: Grievance }> = ({ grievance }) => {
    const StatusIcon = statusIcons[grievance.status];
    
    return (
      <Card className="hover:shadow-card transition-shadow cursor-pointer" 
            onClick={() => onSelectGrievance?.(grievance)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{grievance.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ID: {grievance.id.slice(0, 8)}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(grievance.createdAt), 'MMM dd, yyyy')}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={statusColors[grievance.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {grievance.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className={priorityColors[grievance.priority]}>
                {grievance.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground mb-3 line-clamp-2">
            {grievance.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-medium">Category:</span>
              <span>{grievance.category}</span>
              <span className="font-medium">Department:</span>
              <span>{grievance.department}</span>
            </div>
            
            {showAllGrievances && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{grievance.citizenName}</span>
                <span>•</span>
                <span>{grievance.citizenEmail}</span>
              </div>
            )}
            
            {grievance.location?.address && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{grievance.location.address}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                {grievance.comments.length} comment(s)
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grievances..."
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
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Water Supply">Water Supply</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Road & Infrastructure">Roads</SelectItem>
              <SelectItem value="Sanitation">Sanitation</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredGrievances.length} of {grievances.length} grievances
        </p>
        <Button variant="outline" size="sm" onClick={loadGrievances}>
          Refresh
        </Button>
      </div>

      {/* Grievance Cards */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm ? 'No grievances match your search criteria.' : 'No grievances found.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredGrievances.map((grievance) => (
            <GrievanceCard key={grievance.id} grievance={grievance} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default GrievanceList;