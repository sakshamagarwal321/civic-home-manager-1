import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IndianRupee, Percent, Clock, CreditCard, Building, FileText } from 'lucide-react';

export const FinancialSettingsSection: React.FC = () => {
  const [maintenanceFees, setMaintenanceFees] = useState({
    oneRk: '2500',
    twoRk: '3500',
    threeRk: '4500'
  });

  const [penaltySettings, setPenaltySettings] = useState({
    rate: '2',
    gracePeriod: '10'
  });

  const [otherCharges, setOtherCharges] = useState({
    securityDeposit: '10000',
    communityHall: '500',
    playground: '200'
  });

  const [bankDetails] = useState({
    accountName: 'Greenfield Residency Society',
    accountNumber: '1234567890123456',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank, Sector 12 Branch'
  });

  return (
    <div className="space-y-6">
      {/* Maintenance Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IndianRupee className="mr-2 h-5 w-5" />
            Maintenance Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="one-bhk-fee">1 BHK Monthly Fee</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="one-bhk-fee"
                  value={maintenanceFees.oneRk}
                  onChange={(e) => setMaintenanceFees(prev => ({ ...prev, oneRk: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="two-bhk-fee">2 BHK Monthly Fee</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="two-bhk-fee"
                  value={maintenanceFees.twoRk}
                  onChange={(e) => setMaintenanceFees(prev => ({ ...prev, twoRk: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="three-bhk-fee">3 BHK Monthly Fee</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="three-bhk-fee"
                  value={maintenanceFees.threeRk}
                  onChange={(e) => setMaintenanceFees(prev => ({ ...prev, threeRk: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Payment Penalty */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="mr-2 h-5 w-5" />
            Late Payment Penalty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="penalty-rate">Penalty Rate (% per month)</Label>
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="penalty-rate"
                  value={penaltySettings.rate}
                  onChange={(e) => setPenaltySettings(prev => ({ ...prev, rate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grace-period">Grace Period (days)</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="grace-period"
                  value={penaltySettings.gracePeriod}
                  onChange={(e) => setPenaltySettings(prev => ({ ...prev, gracePeriod: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Charges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Other Charges & Deposits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="security-deposit">Security Deposit</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="security-deposit"
                  value={otherCharges.securityDeposit}
                  onChange={(e) => setOtherCharges(prev => ({ ...prev, securityDeposit: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">For new residents</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="community-hall">Community Hall</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="community-hall"
                  value={otherCharges.communityHall}
                  onChange={(e) => setOtherCharges(prev => ({ ...prev, communityHall: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">Per hour</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="playground">Playground</Label>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="playground"
                  value={otherCharges.playground}
                  onChange={(e) => setOtherCharges(prev => ({ ...prev, playground: e.target.value }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">Per hour</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Bank Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Account Name:</span>
                <span className="text-muted-foreground">{bankDetails.accountName}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Account Number:</span>
                <span className="text-muted-foreground font-mono">{bankDetails.accountNumber}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">IFSC Code:</span>
                <span className="text-muted-foreground font-mono">{bankDetails.ifscCode}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Bank:</span>
                <span className="text-muted-foreground">{bankDetails.bankName}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Update Bank Details
          </Button>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Utilities', 'Security', 'Maintenance', 'Cleaning', 'Landscaping', 'Insurance', 'Legal', 'Administration'].map((category) => (
              <div key={category} className="p-2 bg-muted rounded text-sm text-center">
                {category}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            Manage Categories
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Financial Settings</Button>
      </div>
    </div>
  );
};
