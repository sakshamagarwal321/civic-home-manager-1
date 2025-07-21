
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Wrench, 
  Leaf, 
  FileText, 
  Plus,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const categories = [
  {
    name: 'Security Services',
    amount: 45000,
    percentage: 24,
    icon: Shield,
    color: 'bg-blue-500',
    subcategories: ['Guards Salary', 'CCTV', 'Access Control'],
    indicator: null
  },
  {
    name: 'Utilities',
    amount: 68500,
    percentage: 36.5,
    icon: Zap,
    color: 'bg-yellow-500',
    subcategories: ['Electricity', 'Water', 'Internet'],
    indicator: { type: 'highest', label: 'Highest Expense' }
  },
  {
    name: 'Maintenance & Repairs',
    amount: 42000,
    percentage: 22.4,
    icon: Wrench,
    color: 'bg-orange-500',
    subcategories: ['Elevator', 'Plumbing', 'Painting'],
    indicator: { type: 'active', label: '3 Active Requests' }
  },
  {
    name: 'Landscaping',
    amount: 18000,
    percentage: 9.6,
    icon: Leaf,
    color: 'bg-green-500',
    subcategories: ['Gardening', 'Plants', 'Equipment'],
    indicator: { type: 'seasonal', label: 'Seasonal' }
  },
  {
    name: 'Administration',
    amount: 14000,
    percentage: 7.5,
    icon: FileText,
    color: 'bg-purple-500',
    subcategories: ['Office', 'Legal', 'Banking'],
    indicator: { type: 'fixed', label: 'Fixed Cost' }
  }
];

export const ExpenseCategoriesGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    {category.indicator && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {category.indicator.type === 'highest' && (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {category.indicator.type === 'active' && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {category.indicator.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{category.amount.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                </div>
                
                <Progress value={category.percentage} className="h-2" />
                
                <div className="text-xs text-muted-foreground">
                  {category.subcategories.join(' • ')}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Add New Category Card */}
      <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[200px]">
          <div className="p-4 rounded-lg bg-muted mb-3">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">Add New Category</h3>
          <Button variant="outline" size="sm">
            Create Category
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
