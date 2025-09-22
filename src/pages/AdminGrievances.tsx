import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Grievance } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminGrievances: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [updateComment, setUpdateComment] = useState('');

  useEffect(() => {
    loadGrievances();
  }, [statusFilter, priorityFilter, departmentFilter]);

  const loadGrievances = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (departmentFilter !== 'all') params.department = departmentFilter;
      if (user?.role === 'department' && user.department) {
        params.department = user.department;
      }

      const response = await api.getGrievances(params);
      if (response.success && response.data) {
        setGrievances(response.data.grievances);
      }
    } catch (error) {
      console.error('Failed to load grievances:', error);
      toast({
        title: "Error",
        description: "Failed to load grievances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (grievanceId: string, newStatus: Grievance['status']) => {
    try {
      const response = await api.updateGrievanceStatus(grievanceId, newStatus, updateComment);
      if (response.success) {
        await loadGrievances();
        setSelectedGrievance(null);
        setUpdateComment('');
        toast({
          title: "Status Updated",
          description: `Grievance status updated to ${newStatus.replace('_', ' ')}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update grievance status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock },
      in_progress: { variant: 'default' as const, icon: AlertCircle },
      resolved: { variant: 'default' as const, icon: CheckCircle },
      rejected: { variant: 'destructive' as const, icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'secondary' as const,
      medium: 'outline' as const,
      high: 'default' as const,
      urgent: 'destructive' as const,
    };
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grievance.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || grievance.priority === priorityFilter;
    
    const matchesTab = activeTab === 'all' || grievance.status === activeTab;
    
    return matchesSearch && matchesPriority && matchesTab;
  });

  const getTabCounts = () => {
    return {
      all: grievances.length,
      pending: grievances.filter(g => g.status === 'pending').length,
      in_progress: grievances.filter(g => g.status === 'in_progress').length,
      resolved: grievances.filter(g => g.status === 'resolved').length,
      rejected: grievances.filter(g => g.status === 'rejected').length,
    };
  };

  const tabCounts = getTabCounts();

  const GrievanceCard = ({ grievance }: { grievance: Grievance }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{grievance.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {grievance.citizenName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(grievance.createdAt).toLocaleDateString()}
              </span>
              {grievance.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {grievance.location.address}
                </span>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedGrievance(grievance)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {grievance.status === 'pending' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(grievance.id, 'in_progress')}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Start Processing
                </DropdownMenuItem>
              )}
              {grievance.status === 'in_progress' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(grievance.id, 'resolved')}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Resolved
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleStatusUpdate(grievance.id, 'rejected')}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {grievance.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusBadge(grievance.status)}
            {getPriorityBadge(grievance.priority)}
          </div>
          <Badge variant="outline">{grievance.department}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {user?.role === 'admin' ? 'All Grievances' : 'Department Grievances'}
        </h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin' 
            ? 'Manage and track all grievances across departments'
            : `Manage grievances for ${user?.department} department`
          }
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search grievances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            {user?.role === 'admin' && (
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Public Works">Public Works</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Health & Sanitation">Health & Sanitation</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grievances List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tabCounts.pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({tabCounts.in_progress})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({tabCounts.resolved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({tabCounts.rejected})</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'in_progress', 'resolved', 'rejected'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredGrievances.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGrievances.map((grievance) => (
                  <GrievanceCard key={grievance.id} grievance={grievance} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No grievances found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Grievance Details Dialog */}
      <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGrievance?.title}</DialogTitle>
            <DialogDescription>
              Submitted by {selectedGrievance?.citizenName} on{' '}
              {selectedGrievance && new Date(selectedGrievance.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedGrievance && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedGrievance.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedGrievance.priority)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedGrievance.department}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedGrievance.category}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {selectedGrievance.description}
                </p>
              </div>

              {selectedGrievance.location && (
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedGrievance.location.address}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Contact Information</label>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <p>Email: {selectedGrievance.citizenEmail}</p>
                  <p>Phone: {selectedGrievance.citizenPhone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-sm font-medium">Update Status</label>
                <div className="mt-2 space-y-3">
                  <Textarea
                    placeholder="Add a comment about this update..."
                    value={updateComment}
                    onChange={(e) => setUpdateComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    {selectedGrievance.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(selectedGrievance.id, 'in_progress')}>
                        Start Processing
                      </Button>
                    )}
                    {selectedGrievance.status === 'in_progress' && (
                      <Button size="sm" onClick={() => handleStatusUpdate(selectedGrievance.id, 'resolved')}>
                        Mark Resolved
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleStatusUpdate(selectedGrievance.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGrievances;