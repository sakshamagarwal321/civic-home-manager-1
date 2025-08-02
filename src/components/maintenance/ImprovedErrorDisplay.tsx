
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Phone, Mail, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImprovedErrorDisplayProps {
  error: Error;
  onRetry: () => void;
  isRetrying: boolean;
}

export const ImprovedErrorDisplay: React.FC<ImprovedErrorDisplayProps> = ({
  error,
  onRetry,
  isRetrying
}) => {
  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('No flats assigned')) {
      return 'no_flats';
    }
    if (errorMessage.includes('Database error') || errorMessage.includes('network')) {
      return 'database';
    }
    if (errorMessage.includes('authenticated') || errorMessage.includes('login')) {
      return 'auth';
    }
    return 'unknown';
  };

  const errorType = getErrorType(error.message);

  const renderErrorContent = () => {
    switch (errorType) {
      case 'no_flats':
        return (
          <div className="space-y-4">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>No flats assigned to your account yet.</strong>
                <br />
                Please contact the admin to assign a flat before making maintenance payments.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-medium">Contact Administration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Admin Contact: +91 9876543210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email: admin@ecoresidency.com</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onRetry} disabled={isRetrying} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline">
                Contact Admin
              </Button>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Unable to connect to database.</strong>
                <br />
                Please check your internet connection and try again.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={onRetry} disabled={isRetrying} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                Retry Connection
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        );

      case 'auth':
        return (
          <div className="space-y-4">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                <strong>Authentication required.</strong>
                <br />
                Please log in to access your flat information, or use the test mode below.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={onRetry} disabled={isRetrying} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <Button variant="outline">
                Login
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>An unexpected error occurred.</strong>
                <br />
                {error.message}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button onClick={onRetry} disabled={isRetrying} className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                Retry
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Unable to Load Flat Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderErrorContent()}
      </CardContent>
    </Card>
  );
};
