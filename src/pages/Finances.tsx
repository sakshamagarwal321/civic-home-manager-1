
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ExpenseCategoriesGrid } from '@/components/finances/ExpenseCategoriesGrid';
import { RecentExpensesTable } from '@/components/finances/RecentExpensesTable';
import { ExpenseEntryModal } from '@/components/finances/ExpenseEntryModal';
import { QuickActionsPanel } from '@/components/finances/QuickActionsPanel';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Finances: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('January 2025');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
  const months = [
    'January 2025', 'December 2024', 'November 2024', 'October 2024'
  ];

  const monthlyMetrics = {
    totalExpenses: 187500,
    budgetAllocated: 200000,
    variance: -12500,
    pendingApprovals: 37200
  };

  const budgetUtilization = (monthlyMetrics.totalExpenses / monthlyMetrics.budgetAllocated) * 100;

  return (
    <AppShell>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Financial Management</h1>
              <p className="text-muted-foreground">
                Track expenses, manage budgets, and monitor society finances
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowExpenseModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>

          {/* Monthly Summary Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Monthly Summary</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-48">
                    {selectedMonth}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {months.map((month) => (
                    <DropdownMenuItem 
                      key={month} 
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                  <div className="text-2xl font-bold">₹{monthlyMetrics.totalExpenses.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Budget Allocated</div>
                  <div className="text-2xl font-bold">₹{monthlyMetrics.budgetAllocated.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Variance</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{Math.abs(monthlyMetrics.variance).toLocaleString()}
                    <span className="text-sm font-normal ml-1">under budget</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Pending Approvals</div>
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{monthlyMetrics.pendingApprovals.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Budget Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    {budgetUtilization.toFixed(1)}% utilized
                  </span>
                </div>
                <Progress 
                  value={budgetUtilization} 
                  className="h-2" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹0</span>
                  <span>₹{monthlyMetrics.budgetAllocated.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense Categories Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Expense Categories</h2>
            <ExpenseCategoriesGrid />
          </div>

          {/* Recent Expenses Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
            <RecentExpensesTable />
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-80 flex-shrink-0">
          <QuickActionsPanel />
        </div>
      </div>

      {/* Expense Entry Modal */}
      <ExpenseEntryModal 
        open={showExpenseModal} 
        onOpenChange={setShowExpenseModal} 
      />
    </AppShell>
  );
};

export default Finances;
