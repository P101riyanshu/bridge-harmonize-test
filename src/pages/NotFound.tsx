import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Phone, HelpCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* 404 Error */}
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">What would you like to do?</CardTitle>
            <CardDescription>
              Choose from these quick options to get back on track
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/dashboard" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Link to="/public" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Browse Public Grievances
              </Button>
            </Link>
            
            <Link to="/track" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Track a Grievance
              </Button>
            </Link>
            
            <Link to="/emergency" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Services
              </Button>
            </Link>
            
            <Link to="/help" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Contact Information */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Still can't find what you're looking for?
            </p>
            <Link to="/help">
              <Button variant="link" className="p-0 h-auto">
                Visit our Help Center
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;