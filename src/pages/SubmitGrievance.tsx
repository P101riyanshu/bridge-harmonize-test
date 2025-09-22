import React from 'react';
import { useNavigate } from 'react-router-dom';
import GrievanceForm from '@/components/GrievanceForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

const SubmitGrievance: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/grievances');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit New Grievance</h1>
        <p className="text-muted-foreground">
          Report civic issues and complaints to the appropriate department for prompt resolution.
        </p>
      </div>

      {/* Process Timeline */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">How it Works</CardTitle>
          <CardDescription>
            Your grievance will go through these stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary rounded-full p-3 mb-3">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium mb-1">Submit</h3>
              <p className="text-xs text-muted-foreground">
                Fill out the form with your complaint details
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-warning rounded-full p-3 mb-3">
                <Clock className="h-6 w-6 text-warning-foreground" />
              </div>
              <h3 className="font-medium mb-1">Review</h3>
              <p className="text-xs text-muted-foreground">
                Department reviews and assigns to appropriate officer
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-primary rounded-full p-3 mb-3">
                <AlertCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-medium mb-1">Action</h3>
              <p className="text-xs text-muted-foreground">
                Officer investigates and takes necessary action
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-success rounded-full p-3 mb-3">
                <CheckCircle className="h-6 w-6 text-success-foreground" />
              </div>
              <h3 className="font-medium mb-1">Resolution</h3>
              <p className="text-xs text-muted-foreground">
                Issue resolved and status updated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <GrievanceForm onSuccess={handleSuccess} />

      {/* Help Text */}
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Tips for effective grievances:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Be specific and provide clear details about the issue</li>
            <li>Include location information and photographs if relevant</li>
            <li>Select the appropriate department and category</li>
            <li>Set priority level based on urgency and impact</li>
          </ul>
          <p className="pt-2">
            <strong>Contact:</strong> For technical support, call 1800-XXX-XXXX or email support@civicportal.gov
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitGrievance;