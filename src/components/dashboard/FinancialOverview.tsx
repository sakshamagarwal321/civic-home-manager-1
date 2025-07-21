
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, IndianRupee, Users, Check, Bell, Plus, Send, AlertCircle } from 'lucide-react';

const FinancialOverview: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Collection Details Modal Component
  const CollectionDetailsModal = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Monthly Collection Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/10 rounded-lg">
            <h4 className="font-semibold text-success">Collected</h4>
            <p className="text-2xl font-mono font-bold">₹2,45,000</p>
            <p className="text-sm text-muted-foreground">92 residents paid</p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg">
            <h4 className="font-semibold text-warning">Target</h4>
            <p className="text-2xl font-mono font-bold">₹2,77,000</p>
            <p className="text-sm text-muted-foreground">100 total residents</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Collection Progress</span>
            <span>88.4%</span>
          </div>
          <Progress value={88.4} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-lg font-semibold">₹2,45,000</p>
            <p className="text-xs text-success">+12% vs last month</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Last Month</p>
            <p className="text-lg font-semibold">₹2,18,500</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Same Month Last Year</p>
            <p className="text-lg font-semibold">₹2,32,000</p>
            <p className="text-xs text-success">+5.6% YoY</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  // Outstanding Dues Modal Component
  const OutstandingDuesModal = () => (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Outstanding Dues Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-700">{"< 30 days"}</h4>
            <p className="text-xl font-mono font-bold">₹18,500</p>
            <p className="text-sm text-muted-foreground">5 residents</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-700">30-60 days</h4>
            <p className="text-xl font-mono font-bold">₹10,000</p>
            <p className="text-sm text-muted-foreground">2 residents</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-700">{"> 60 days"}</h4>
            <p className="text-xl font-mono font-bold">₹3,500</p>
            <p className="text-sm text-muted-foreground">1 resident</p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Overdue Residents</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { name: "Rajesh Kumar", flat: "A-301", amount: 7000, days: 45 },
              { name: "Priya Sharma", flat: "B-205", amount: 3500, days: 15 },
              { name: "Amit Patel", flat: "C-102", amount: 3500, days: 75 },
              { name: "Sunita Verma", flat: "A-404", amount: 7000, days: 30 },
              { name: "Vikram Singh", flat: "B-301", amount: 3500, days: 20 },
              { name: "Meera Joshi", flat: "C-205", amount: 3500, days: 25 },
              { name: "Ravi Gupta", flat: "A-102", amount: 3500, days: 10 },
              { name: "Kavita Nair", flat: "B-404", amount: 7000, days: 35 }
            ].map((resident, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{resident.name}</p>
                  <p className="text-sm text-muted-foreground">Flat {resident.flat}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold">₹{resident.amount.toLocaleString()}</p>
                  <p className={`text-sm ${resident.days > 60 ? 'text-red-600' : resident.days > 30 ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {resident.days} days overdue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-2 pt-4">
          <Button className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Send Reminders to All
          </Button>
          <Button variant="outline" className="flex-1">
            Generate Report
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  // Pending Approvals Modal Component
  const PendingApprovalsModal = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Pending Approvals Queue</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
          <div>
            <h4 className="font-semibold">Total Pending Amount</h4>
            <p className="text-2xl font-mono font-bold">₹37,200</p>
          </div>
          <Badge variant="destructive">5 Pending</Badge>
        </div>
        <div className="space-y-3">
          {[
            { title: "Plumber Payment", amount: 3200, priority: "high", date: "2 days ago" },
            { title: "Garden Maintenance", amount: 8500, priority: "medium", date: "1 day ago" },
            { title: "Security Equipment", amount: 15600, priority: "medium", date: "3 days ago" },
            { title: "Parking Allocation", amount: 0, priority: "low", date: "4 days ago" },
            { title: "Elevator Maintenance", amount: 12000, priority: "high", date: "5 days ago" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">Submitted {item.date}</p>
              </div>
              <div className="text-right">
                {item.amount > 0 && (
                  <p className="font-mono font-semibold">₹{item.amount.toLocaleString()}</p>
                )}
                <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                  {item.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full">
          Review All Approvals
        </Button>
      </div>
    </DialogContent>
  );

  const financialData = [
    {
      id: 'collection',
      title: 'Total Monthly Collection',
      value: '₹2,45,000',
      change: '+12%',
      changeType: 'positive' as const,
      icon: IndianRupee,
      target: 277000,
      current: 245000,
      modal: CollectionDetailsModal
    },
    {
      id: 'dues',
      title: 'Outstanding Dues',
      value: '₹32,000',
      subtitle: '8 residents',
      change: '-5%',
      changeType: 'positive' as const,
      icon: Users,
      hasAlert: true,
      modal: OutstandingDuesModal
    },
    {
      id: 'expenses',
      title: 'This Month Expenses',
      value: '₹1,87,500',
      change: '₹12,500 under budget',
      changeType: 'positive' as const,
      icon: TrendingDown,
      budgetVariance: -12500,
      showMiniChart: true
    },
    {
      id: 'approvals',
      title: 'Pending Approvals',
      value: '5',
      subtitle: '₹37,200 total',
      change: '+2 new',
      changeType: 'neutral' as const,
      icon: Bell,
      hasNotification: true,
      modal: PendingApprovalsModal
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {financialData.map((item) => (
        <Dialog key={item.id} open={selectedCard === item.id} onOpenChange={(open) => setSelectedCard(open ? item.id : null)}>
          <DialogTrigger asChild>
            <Card className="dashboard-card hover-lift cursor-pointer transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <div className="relative">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{item.value}</div>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors">
                    {item.subtitle}
                  </p>
                )}
                
                {/* Collection Progress */}
                {item.id === 'collection' && item.target && item.current && (
                  <div className="mt-2">
                    <Progress value={(item.current / item.target) * 100} className="h-1" />
                  </div>
                )}

                {/* Expenses Budget Indicator */}
                {item.id === 'expenses' && item.budgetVariance && (
                  <div className="mt-2 flex items-center">
                    <Check className="h-3 w-3 text-success mr-1" />
                    <span className="text-xs text-success">Under Budget</span>
                  </div>
                )}

                {/* Outstanding Dues Alert */}
                {item.id === 'dues' && item.hasAlert && (
                  <div className="mt-2 flex items-center">
                    <AlertCircle className="h-3 w-3 text-orange-500 mr-1" />
                    <span className="text-xs text-orange-500">Action Required</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${
                    item.changeType === 'positive' ? 'financial-positive' : 'financial-neutral'
                  } flex items-center`}>
                    {item.changeType === 'positive' && item.change.includes('+') && (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    )}
                    {item.change}
                  </p>
                  
                  {/* Quick Actions */}
                  {item.id === 'dues' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle send reminders
                      }}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Remind
                    </Button>
                  )}
                  
                  {item.id === 'expenses' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add expense
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          
          {item.modal && <item.modal />}
        </Dialog>
      ))}
    </div>
  );
};

export { FinancialOverview };
