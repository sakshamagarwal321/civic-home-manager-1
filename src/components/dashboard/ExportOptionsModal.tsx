
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, FileText, Mail, Clock } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ExportOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExportFormData {
  reportType: string;
  formats: {
    pdf: boolean;
    excel: boolean;
    csv: boolean;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
  includeOptions: {
    charts: boolean;
    vendorDetails: boolean;
    approvalStatus: boolean;
  };
}

const presetRanges = [
  { label: 'This Month', from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
  { label: 'Last 3 Months', from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) },
  { label: 'This Year', from: new Date(new Date().getFullYear(), 0, 1), to: new Date() },
];

export const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [formData, setFormData] = useState<ExportFormData>({
    reportType: 'current-month',
    formats: { pdf: true, excel: false, csv: false },
    dateRange: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    },
    includeOptions: {
      charts: true,
      vendorDetails: false,
      approvalStatus: false
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showEmailOption, setShowEmailOption] = useState(false);

  const reportTypes = [
    { value: 'current-month', label: 'Current Month Summary', description: 'January 2025' },
    { value: 'detailed', label: 'Detailed Expense Report', description: 'All transactions with full details' },
    { value: 'budget-analysis', label: 'Budget vs Actual Analysis', description: 'Variance analysis with insights' },
    { value: 'category-breakdown', label: 'Category-wise Breakdown', description: 'Expenses grouped by category' }
  ];

  const handleFormatChange = (format: keyof typeof formData.formats, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      formats: { ...prev.formats, [format]: checked }
    }));
  };

  const handleIncludeOptionChange = (option: keyof typeof formData.includeOptions, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      includeOptions: { ...prev.includeOptions, [option]: checked }
    }));
  };

  const handlePresetRange = (preset: typeof presetRanges[0]) => {
    setFormData(prev => ({
      ...prev,
      dateRange: { from: preset.from, to: preset.to }
    }));
  };

  const simulateExportProgress = () => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const generateFileName = (format: string) => {
    const reportTypeMap = {
      'current-month': 'MonthlyReport',
      'detailed': 'DetailedExpenses',
      'budget-analysis': 'BudgetAnalysis',
      'category-breakdown': 'CategoryBreakdown'
    };
    
    const reportName = reportTypeMap[formData.reportType as keyof typeof reportTypeMap] || 'FinancialReport';
    const dateStr = format(formData.dateRange.from, 'MMMyyyy');
    const timestamp = format(new Date(), 'yyyyMMdd_HHmm');
    
    return `${reportName}_${dateStr}_${timestamp}.${format}`;
  };

  const handleExport = async () => {
    const selectedFormats = Object.entries(formData.formats)
      .filter(([_, selected]) => selected)
      .map(([format]) => format);

    if (selectedFormats.length === 0) {
      toast({
        title: "No Format Selected",
        description: "Please select at least one export format.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    const progressInterval = simulateExportProgress();

    try {
      // Simulate export processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate and download files
      for (const format of selectedFormats) {
        const fileName = generateFileName(format);
        
        // Create a mock file content based on format
        let content = '';
        let mimeType = '';
        
        switch (format) {
          case 'pdf':
            content = 'Mock PDF content for financial report';
            mimeType = 'application/pdf';
            break;
          case 'excel':
            content = 'Mock Excel content with financial data';
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
          case 'csv':
            content = 'Date,Description,Category,Amount,Status,Vendor\n2025-01-15,Electricity Bill,Utilities,18500,Approved,Power Company\n2025-01-14,Security Guards,Security,25000,Approved,SecureGuard Services';
            mimeType = 'text/csv';
            break;
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      toast({
        title: "Export Complete",
        description: `${selectedFormats.length} file(s) exported successfully`,
      });

      // Reset and close modal after success
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        onOpenChange(false);
      }, 1000);

    } catch (error) {
      clearInterval(progressInterval);
      setIsExporting(false);
      setExportProgress(0);
      
      toast({
        title: "Export Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export Financial Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <Label className="text-base font-medium">Export Type</Label>
            <RadioGroup 
              value={formData.reportType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
              className="mt-3"
            >
              {reportTypes.map((type) => (
                <div key={type.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={type.value} id={type.value} className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor={type.value} className="font-medium cursor-pointer">
                      {type.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Format Selection */}
          <div>
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-3 gap-4 mt-3">
              {Object.entries(formData.formats).map(([format, selected]) => (
                <div key={format} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox 
                    id={format}
                    checked={selected}
                    onCheckedChange={(checked) => handleFormatChange(format as keyof typeof formData.formats, checked as boolean)}
                  />
                  <Label htmlFor={format} className="font-medium capitalize cursor-pointer">
                    {format.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <Label className="text-base font-medium">Date Range</Label>
            <div className="space-y-3 mt-3">
              <div className="flex gap-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetRange(preset)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateRange.from ? format(formData.dateRange.from, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateRange.from}
                        onSelect={(date) => date && setFormData(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, from: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateRange.to ? format(formData.dateRange.to, "MMM dd, yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dateRange.to}
                        onSelect={(date) => date && setFormData(prev => ({ 
                          ...prev, 
                          dateRange: { ...prev.dateRange, to: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <Label className="text-base font-medium">Include Options</Label>
            <div className="space-y-3 mt-3">
              {Object.entries(formData.includeOptions).map(([option, selected]) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option}
                    checked={selected}
                    onCheckedChange={(checked) => handleIncludeOptionChange(option as keyof typeof formData.includeOptions, checked as boolean)}
                  />
                  <Label htmlFor={option} className="capitalize cursor-pointer">
                    {option.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Preparing your report...</span>
                <span className="text-sm text-muted-foreground">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          {/* Additional Options */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Additional Options</Label>
                <p className="text-xs text-muted-foreground">
                  Send report via email or set up scheduled exports
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowEmailOption(!showEmailOption)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Generating...' : 'Generate Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
