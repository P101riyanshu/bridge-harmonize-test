import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Department } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, X, MapPin } from 'lucide-react';

interface GrievanceFormProps {
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Road & Infrastructure',
  'Sanitation',
  'Public Transport',
  'Healthcare',
  'Education',
  'Police & Security',
  'Environment',
  'Tax & Revenue',
  'Other'
];

const GrievanceForm: React.FC<GrievanceFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    location: {
      address: '',
      latitude: undefined as number | undefined,
      longitude: undefined as number | undefined,
    }
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const response = await api.getDepartments();
    if (response.success && response.data) {
      setDepartments(response.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const grievanceData = {
        ...formData,
        citizenId: user.id,
        citizenName: user.name,
        citizenEmail: user.email,
        citizenPhone: user.phone,
        attachments: uploadedFiles,
      };

      const response = await api.createGrievance(grievanceData);
      
      if (response.success) {
        toast({
          title: "Grievance submitted successfully",
          description: "Your grievance has been registered and assigned a tracking ID.",
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          department: '',
          priority: 'medium',
          location: { 
            address: '',
            latitude: undefined,
            longitude: undefined
          }
        });
        setUploadedFiles([]);
        
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Submission failed",
          description: response.error || "Failed to submit grievance",
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
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingFiles(files);
    
    try {
      const uploadPromises = files.map(file => api.uploadFile(file));
      const responses = await Promise.all(uploadPromises);
      
      const successfulUploads = responses
        .filter(response => response.success && response.data)
        .map(response => response.data!.url);
      
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
      
      if (successfulUploads.length > 0) {
        toast({
          title: "Files uploaded",
          description: `${successfulUploads.length} file(s) uploaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles([]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          }));
          toast({
            title: "Location captured",
            description: "GPS coordinates have been added to your grievance",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Submit New Grievance</CardTitle>
        <CardDescription>
          Fill out the form below to register your complaint or grievance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title for your grievance"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the issue..."
              className="w-full min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                required
                value={formData.department}
                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Priority Level</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-sm">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="text-sm">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Location</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Enter address or location details"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={getCurrentLocation}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.location.latitude && formData.location.longitude && (
              <p className="text-xs text-muted-foreground">
                GPS: {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Attachments (Optional)</Label>
            <div className="space-y-2">
              <Input
                id="files"
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: Images, PDF, Word documents (Max 5MB per file)
              </p>
              
              {uploadingFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading {uploadingFiles.length} file(s)...
                </div>
              )}
              
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm truncate">{file.split('/').pop()}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary shadow-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Grievance...
              </>
            ) : (
              'Submit Grievance'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GrievanceForm;