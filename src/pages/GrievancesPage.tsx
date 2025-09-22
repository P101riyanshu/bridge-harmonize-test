import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GrievanceList from '@/components/GrievanceList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Grievance } from '@/lib/api';
import { 
  Plus, 
  FileText, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const GrievancesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-warning text-warning-foreground', label: 'Pending' },
    in_progress: { icon: AlertCircle, color: 'bg-primary text-primary-foreground', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: 'bg-success text-success-foreground', label: 'Resolved' },
    rejected: { icon: XCircle, color: 'bg-destructive text-destructive-foreground', label: 'Rejected' },
  };

  const priorityConfig = {
    low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
    medium: { color: 'bg-warning/20 text-warning-foreground border-warning/50', label: 'Medium' },
    high: { color: 'bg-destructive/20 text-destructive-foreground border-destructive/50', label: 'High' },
    urgent: { color: 'bg-destructive text-destructive-foreground', label: 'Urgent' },
  };

  const GrievanceDetailDialog = () => {
    if (!selectedGrievance) return null;

    const StatusIcon = statusConfig[selectedGrievance.status].icon;
    
    return (
      <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedGrievance.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex flex-wrap gap-3">
              <Badge className={statusConfig[selectedGrievance.status].color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[selectedGrievance.status].label}
              </Badge>
              <Badge variant="outline" className={priorityConfig[selectedGrievance.priority].color}>
                {priorityConfig[selectedGrievance.priority].label} Priority
              </Badge>
              <Badge variant="outline">
                {selectedGrievance.category}
              </Badge>
              <Badge variant="outline">
                {selectedGrievance.department}
              </Badge>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Grievance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong className="text-sm">ID:</strong>
                    <p className="text-sm text-muted-foreground">{selectedGrievance.id}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Submitted:</strong>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(selectedGrievance.createdAt), 'PPpp')}
                    </p>
                  </div>
                  {selectedGrievance.updatedAt !== selectedGrievance.createdAt && (
                    <div>
                      <strong className="text-sm">Last Updated:</strong>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedGrievance.updatedAt), 'PPpp')}
                      </p>
                    </div>
                  )}
                  {selectedGrievance.resolvedAt && (
                    <div>
                      <strong className="text-sm">Resolved:</strong>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(selectedGrievance.resolvedAt), 'PPpp')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Citizen Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedGrievance.citizenName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedGrievance.citizenEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedGrievance.citizenPhone}</span>
                  </div>
                  {selectedGrievance.location?.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{selectedGrievance.location.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedGrievance.description}
                </p>
              </CardContent>
            </Card>

            {/* Attachments */}
            {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {selectedGrievance.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 border rounded hover:bg-muted transition-colors"
                      >
                        <div className="text-xs truncate">
                          {attachment.split('/').pop()}
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {selectedGrievance.comments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments & Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedGrievance.comments.map((comment, index) => (
                      <div key={comment.id}>
                        <div className="flex items-start gap-3">
                          <div className="bg-primary rounded-full p-2 text-primary-foreground text-xs font-medium">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <Badge variant="outline" className="text-xs">
                                {comment.userRole}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                              {comment.message}
                            </p>
                          </div>
                        </div>
                        {index < selectedGrievance.comments.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user?.role === 'citizen' ? 'My Grievances' : 'All Grievances'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'citizen' 
              ? 'Track the status of your submitted grievances' 
              : 'Monitor and manage civic grievances'
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

      {/* Grievances List */}
      <GrievanceList 
        showAllGrievances={user?.role !== 'citizen'}
        onSelectGrievance={setSelectedGrievance}
      />

      {/* Grievance Detail Dialog */}
      <GrievanceDetailDialog />
    </div>
  );
};

export default GrievancesPage;