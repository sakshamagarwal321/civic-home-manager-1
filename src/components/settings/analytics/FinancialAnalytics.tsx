
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const monthlyFinancials = [
  { month: 'Jan', revenue: 240000, expenses: 180000, maintenance: 120000, utilities: 35000, repairs: 25000, budget: 220000 },
  { month: 'Feb', revenue: 245000, expenses: 175000, maintenance: 115000, utilities: 38000, repairs: 22000, budget: 225000 },
  { month: 'Mar', revenue: 250000, expenses: 187500, maintenance: 125000, utilities: 40000, repairs: 22500, budget: 230000 },
  { month: 'Apr', revenue: 245000, expenses: 190000, maintenance: 130000, utilities: 35000, repairs: 25000, budget: 235000 },
  { month: 'May', revenue: 252000, expenses: 185000, maintenance: 120000, utilities: 42000, repairs: 23000, budget: 240000 },
  { month: 'Jun', revenue: 248000, expenses: 182000, maintenance: 118000, utilities: 38000, repairs: 26000, budget: 245000 },
];

const expenseBreakdown = [
  { name: 'Maintenance', value: 120000, color: '#3b82f6' },
  { name: 'Utilities', value: 38000, color: '#10b981' },
  { name: 'Security', value: 45000, color: '#f59e0b' },
  { name: 'Cleaning', value: 25000, color: '#ef4444' },
  { name: 'Repairs', value: 26000, color: '#8b5cf6' },
  { name: 'Administration', value: 15000, color: '#06b6d4' },
];

const outstandingDues = [
  { range: 'Current Month', amount: 25000, count: 8 },
  { range: '1-30 Days', amount: 45000, count: 12 },
  { range: '31-60 Days', amount: 18000, count: 4 },
  { range: '60+ Days', amount: 12000, count: 2 },
];

const topVendors = [
  { name: 'ABC Maintenance Services', spend: 85000, payments: 12, avgDays: 15 },
  { name: 'City Utilities Corporation', spend: 45000, payments: 6, avgDays: 30 },
  { name: 'Security Guard Services', spend: 42000, payments: 6, avgDays: 7 },
  { name: 'Cleaning Services Ltd', spend: 25000, payments: 6, avgDays: 10 },
  { name: 'Repair & Fix Solutions', spend: 18000, payments: 8, avgDays: 12 },
];

export const FinancialAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">₹14,80,000</p>
                <p className="text-xs text-green-600">+8.2% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-red-600">₹11,20,000</p>
                <p className="text-xs text-red-600">+3.1% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Surplus</p>
                <p className="text-xl font-bold text-blue-600">₹3,60,000</p>
                <p className="text-xs text-blue-600">+15.3% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding Dues</p>
                <p className="text-xl font-bold text-orange-600">₹1,00,000</p>
                <p className="text-xs text-orange-600">26 residents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Financial Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          <TabsTrigger value="budget">Budget Variance</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Budget Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyFinancials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Actual Revenue" />
                    <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Budgeted Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyFinancials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ₹${(value/1000)}K`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expense Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyFinancials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="maintenance" stackId="a" fill="#3b82f6" name="Maintenance" />
                    <Bar dataKey="utilities" stackId="a" fill="#10b981" name="Utilities" />
                    <Bar dataKey="repairs" stackId="a" fill="#f59e0b" name="Repairs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Variance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseBreakdown.map((category) => {
                  const budgeted = category.value * 1.1;
                  const variance = ((category.value - budgeted) / budgeted) * 100;
                  return (
                    <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Actual: ₹{category.value.toLocaleString()} | Budgeted: ₹{budgeted.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={variance > 0 ? "destructive" : "default"}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVendors.map((vendor, index) => (
                    <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {vendor.payments} payments | Avg. {vendor.avgDays} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{vendor.spend.toLocaleString()}</p>
                        <Badge variant="outline">{((vendor.spend / 300000) * 100).toFixed(1)}% of total</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outstanding Dues Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={outstandingDues}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#ef4444" name="Amount (₹)" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {outstandingDues.map((due) => (
                    <div key={due.range} className="text-center">
                      <p className="text-sm text-muted-foreground">{due.range}</p>
                      <p className="font-bold">₹{due.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{due.count} residents</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
