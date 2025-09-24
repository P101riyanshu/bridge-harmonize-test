import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  QrCode, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircle,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const GrievanceTracker: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [grievanceData, setGrievanceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setLoading(true);
    
    // Mock API call - replace with actual tracking
    setTimeout(() => {
      if (trackingId.toLowerCase().includes('grv')) {
        setGrievanceData({
          id: trackingId.toUpperCase(),
          title: 'Street Light Not Working',
          description: 'The street light in front of house number 123 has been non-functional for the past week.',
          status: 'in_progress',
          priority: 'medium',
          category: 'Infrastructure',
          department: 'Municipal Corporation',
          submittedDate: '2024-01-15T10:30:00Z',
          lastUpdated: '2024-01-18T14:20:00Z',
          estimatedResolution: '2024-01-25T18:00:00Z',
          citizenName: 'John Doe',
          citizenEmail: 'john.doe@email.com',
          citizenPhone: '+91 98765 43210',
          location: {
            address: '123 Main Street, Sector 15, New Delhi - 110001'
          },
          timeline: [
            {
              date: '2024-01-15T10:30:00Z',
              status: 'submitted',
              title: 'Grievance Submitted',
              description: 'Your complaint has been successfully submitted and assigned ID: ' + trackingId.toUpperCase(),
              officer: null
            },
            {
              date: '2024-01-16T09:15:00Z',
              status: 'acknowledged',
              title: 'Complaint Acknowledged',
              description: 'Your complaint has been received and is under review by the Municipal Corporation.',
              officer: 'System Admin'
            },
            {
              date: '2024-01-17T11:45:00Z',
              status: 'assigned',
              title: 'Assigned to Field Officer',
              description: 'Your complaint has been assigned to field officer Rajesh Kumar for inspection.',
              officer: 'Dept. Supervisor'
            },
            {
              date: '2024-01-18T14:20:00Z',
              status: 'in_progress',
              title: 'Site Inspection Completed',
              description: 'Site inspection completed. Issue confirmed. Work order has been created for street light repair.',
              officer: 'Rajesh Kumar'
            }
          ]
        });
      } else {
        setGrievanceData(null);
      }
      setLoading(false);
    }, 1500);
  };

  const statusConfig = {
    submitted: { icon: FileText, color: 'bg-muted text-muted-foreground', label: 'Submitted' },
    acknowledged: { icon: Clock, color: 'bg-warning text-warning-foreground', label: 'Acknowledged' },
    assigned: { icon: AlertCircle, color: 'bg-primary text-primary-foreground', label: 'Assigned' },
    in_progress: { icon: AlertCircle, color: 'bg-primary text-primary-foreground', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: 'bg-success text-success-foreground', label: 'Resolved' },
    rejected: { icon: XCircle, color: 'bg-destructive text-destructive-foreground', label: 'Rejected' },
  };

  const TimelineItem = ({ item, isLast }: { item: any, isLast: boolean }) => {
    const config = statusConfig[item.status] || statusConfig.submitted;
    const Icon = config.icon;
    
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className={`p-2 rounded-full ${config.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          {!isLast && <div className="w-px h-8 bg-border mt-2" />}
        </div>
        <div className="flex-1 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <Badge variant="outline" className="text-xs">
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{format(new Date(item.date), 'MMM dd, yyyy HH:mm')}</span>
            {item.officer && (
              <>
                <span>•</span>
                <span>by {item.officer}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Grievance</h1>
        <p className="text-muted-foreground">
          Enter your grievance ID to track the current status and timeline of your complaint.
        </p>
      </div>

      {/* Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Grievance Tracker
          </CardTitle>
          <CardDescription>
            Enter your 8-character grievance ID (e.g., GRV-001, GRV-ABC123)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Grievance ID (e.g., GRV-001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleTrack} 
              disabled={loading || !trackingId.trim()}
              className="gradient-primary shadow-primary"
            >
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-4 border-t text-sm text-muted-foreground">
            <QrCode className="h-4 w-4" />
            <span>You can also scan the QR code from your grievance receipt</span>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {grievanceData && (
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{grievanceData.title}</CardTitle>
                  <CardDescription className="mt-1">
                    ID: {grievanceData.id} • Submitted on {format(new Date(grievanceData.submittedDate), 'PPP')}
                  </CardDescription>
                </div>
                <Badge className={statusConfig[grievanceData.status]?.color || statusConfig.submitted.color}>
                  {statusConfig[grievanceData.status]?.label || 'Submitted'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{grievanceData.description}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Category</h4>
                      <p className="text-sm text-muted-foreground">{grievanceData.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Department</h4>
                      <p className="text-sm text-muted-foreground">{grievanceData.department}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Priority</h4>
                      <Badge variant="outline">{grievanceData.priority.toUpperCase()}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h4>
                    <p className="text-sm text-muted-foreground">{grievanceData.location.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Dates</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>Last Updated: {format(new Date(grievanceData.lastUpdated), 'PPp')}</span>
                      </div>
                      {grievanceData.estimatedResolution && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Est. Resolution: {format(new Date(grievanceData.estimatedResolution), 'PPp')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{grievanceData.citizenName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{grievanceData.citizenEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{grievanceData.citizenPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Progress Timeline
              </CardTitle>
              <CardDescription>
                Track the progress of your grievance from submission to resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {grievanceData.timeline.map((item: any, index: number) => (
                  <TimelineItem 
                    key={index} 
                    item={item} 
                    isLast={index === grievanceData.timeline.length - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results */}
      {trackingId && grievanceData === null && !loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Grievance Not Found</p>
              <p className="text-sm">
                Please check your grievance ID and try again. Make sure you're using the correct format (e.g., GRV-001).
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GrievanceTracker;