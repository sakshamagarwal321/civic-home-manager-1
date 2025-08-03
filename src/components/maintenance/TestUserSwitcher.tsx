
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, RefreshCw } from 'lucide-react';

interface TestUser {
  id: string;
  name: string;
  flatNumber: string;
  type: string;
}

interface TestUserSwitcherProps {
  currentUser: { id: string; name: string } | null;
  onUserSwitch: (userId: string, name: string) => void;
}

const testUsers: TestUser[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Rajesh Kumar',
    flatNumber: 'A-301',
    type: 'Owner'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Priya Sharma',
    flatNumber: 'B-202',
    type: 'Owner'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Amit Patel',
    flatNumber: 'C-103',
    type: 'Tenant'
  }
];

export const TestUserSwitcher: React.FC<TestUserSwitcherProps> = ({ 
  currentUser, 
  onUserSwitch 
}) => {
  const handleUserSwitch = (userId: string, name: string) => {
    console.log('=== USER SWITCH TRIGGERED ===');
    console.log('Switching to user:', { userId, name });
    onUserSwitch(userId, name);
  };

  return (
    <Card className="mb-4 bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Test User Switcher (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {testUsers.map((user) => {
            const isActive = currentUser?.id === user.id;
            return (
              <Button
                key={user.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleUserSwitch(user.id, user.name)}
                className={`flex items-center gap-2 ${isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {isActive && <CheckCircle className="h-3 w-3" />}
                {user.name}
                <Badge variant="secondary" className="text-xs">
                  {user.flatNumber} ({user.type})
                </Badge>
              </Button>
            );
          })}
        </div>
        {currentUser && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
            <p className="text-green-800 font-medium">
              ✓ Currently logged in as: <strong>{currentUser.name}</strong>
            </p>
            <p className="text-green-600 text-xs mt-1">
              <RefreshCw className="inline h-3 w-3 mr-1" />
              Loading flats assigned to this user...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
