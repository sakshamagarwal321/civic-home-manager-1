import React from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              View your profile information and manage settings
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Rajesh Kumar</h2>
                <p className="text-muted-foreground">rajesh.kumar@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flat Assignments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              Flat Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">A-301</h4>
                    <p className="text-sm text-muted-foreground">Block A • 3rd Floor</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Owner</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">2BHK</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <span className="ml-2 font-medium">1200 sq ft</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Possession:</span>
                    <span className="ml-2 font-medium">March 15, 2020</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedAppShell>
  );
};

export default Profile;
