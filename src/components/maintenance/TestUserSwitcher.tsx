
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

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
  return (
    <Card className="mb-4 bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Test User Switcher (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {testUsers.map((user) => (
            <Button
              key={user.id}
              variant={currentUser?.id === user.id ? "default" : "outline"}
              size="sm"
              onClick={() => onUserSwitch(user.id, user.name)}
              className="flex items-center gap-2"
            >
              {user.name}
              <Badge variant="secondary" className="text-xs">
                {user.flatNumber} ({user.type})
              </Badge>
            </Button>
          ))}
        </div>
        {currentUser && (
          <p className="text-sm text-muted-foreground mt-2">
            Currently logged in as: <strong>{currentUser.name}</strong>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
