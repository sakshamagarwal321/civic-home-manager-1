
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const NoFlatsAssigned: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          No Flats Assigned
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No flats are currently assigned to your account. Please contact the admin to assign a flat before making maintenance payments.
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

        <div className="pt-4">
          <Button variant="outline" className="w-full">
            Contact Admin for Flat Assignment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
