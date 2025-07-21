import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, IndianRupee, Users } from 'lucide-react';

const financialData = [
  {
    title: 'Total Monthly Collection',
    value: '₹2,45,000',
    change: '+12%',
    changeType: 'positive' as const,
    icon: IndianRupee,
  },
  {
    title: 'Outstanding Dues',
    value: '₹32,000',
    subtitle: '8 residents',
    change: '-5%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'This Month Expenses',
    value: '₹1,87,500',
    change: '₹12,500 under budget',
    changeType: 'positive' as const,
    icon: TrendingDown,
  },
  {
    title: 'Pending Approvals',
    value: '5',
    subtitle: '₹37,200 total',
    change: '+2 new',
    changeType: 'neutral' as const,
    icon: TrendingUp,
  },
];

export const FinancialOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {financialData.map((item, index) => (
        <Card key={index} className="dashboard-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{item.value}</div>
            {item.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
            )}
            <p
              className={`text-xs mt-1 ${
                item.changeType === 'positive'
                  ? 'financial-positive'
                  : 'financial-neutral'
              }`}
            >
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};