
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, MapPin, Calendar, Building2, Phone, Mail, Globe } from 'lucide-react';

export const SocietyInformationSection: React.FC = () => {
  const [societyData, setSocietyData] = useState({
    name: 'Greenfield Residency',
    registrationNumber: 'MH/2018/0123456',
    address: '123 Green Avenue, Sector 12, Pune, Maharashtra 411027',
    establishmentDate: '2018-03-15',
    totalFlats: '120',
    phone: '+91 20 2345 6789',
    email: 'info@greenfieldresidency.com',
    website: 'www.greenfieldresidency.com',
    legalStatus: 'registered-society'
  });

  const [committeeData] = useState({
    term: '2023-2025',
    secretary: { name: 'Rajesh Kumar', phone: '+91 9876543210' },
    treasurer: { name: 'Priya Sharma', phone: '+91 9876543211' },
    jointSecretary: { name: 'Amit Patel', phone: '+91 9876543212' },
    nextElection: '2025-03-15',
    meetingFrequency: 'Monthly - First Sunday'
  });

  const handleInputChange = (field: string, value: string) => {
    setSocietyData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Basic Society Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="society-name">Society Name</Label>
              <Input
                id="society-name"
                value={societyData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration-number">Registration Number</Label>
              <Input
                id="registration-number"
                value={societyData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Complete Address</Label>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-3 text-muted-foreground" />
              <Textarea
                id="address"
                value={societyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="establishment-date">Establishment Date</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="establishment-date"
                  type="date"
                  value={societyData.establishmentDate}
                  onChange={(e) => handleInputChange('establishmentDate', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-flats">Total Flats</Label>
              <Input
                id="total-flats"
                value={societyData.totalFlats}
                onChange={(e) => handleInputChange('totalFlats', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legal-status">Legal Status</Label>
              <Select value={societyData.legalStatus} onValueChange={(value) => handleInputChange('legalStatus', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registered-society">Registered Society</SelectItem>
                  <SelectItem value="cooperative-society">Cooperative Society</SelectItem>
                  <SelectItem value="private-limited">Private Limited Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={societyData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={societyData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={societyData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Society Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Committee Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Committee Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Term:</span>
                <span className="text-muted-foreground">{committeeData.term}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Secretary:</span>
                  <div className="text-right">
                    <div>{committeeData.secretary.name}</div>
                    <div className="text-sm text-muted-foreground">{committeeData.secretary.phone}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Treasurer:</span>
                  <div className="text-right">
                    <div>{committeeData.treasurer.name}</div>
                    <div className="text-sm text-muted-foreground">{committeeData.treasurer.phone}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Joint Secretary:</span>
                  <div className="text-right">
                    <div>{committeeData.jointSecretary.name}</div>
                    <div className="text-sm text-muted-foreground">{committeeData.jointSecretary.phone}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Next Election:</span>
                <span className="text-muted-foreground">{committeeData.nextElection}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Meeting Schedule:</span>
                <span className="text-muted-foreground">{committeeData.meetingFrequency}</span>
              </div>
              <Button variant="outline" className="w-full">
                Edit Committee Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};
