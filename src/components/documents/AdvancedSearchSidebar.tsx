
import React, { useState } from 'react';
import { Calendar, FileType, User, Shield, HardDrive, TrendingUp, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SearchFilters {
  dateRange: { start: Date | null; end: Date | null };
  fileTypes: string[];
  categories: string[];
  uploadedBy: string[];
  accessLevel: string[];
  fileSizeRange: [number, number];
  downloadCountFilter: string;
}

interface AdvancedSearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export const AdvancedSearchSidebar: React.FC<AdvancedSearchSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fileTypes = [
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'doc', label: 'Word', icon: '📝' },
    { value: 'xls', label: 'Excel', icon: '📊' },
    { value: 'ppt', label: 'PowerPoint', icon: '📽️' },
    { value: 'jpg', label: 'Images', icon: '🖼️' },
  ];

  const categories = [
    'Society Bylaws', 'Meeting Minutes', 'Financial Records', 
    'Legal Documents', 'Notices & Circulars', 'Maintenance Records'
  ];

  const accessLevels = [
    { value: 'public', label: 'Public' },
    { value: 'members', label: 'Members Only' },
    { value: 'committee', label: 'Committee' },
    { value: 'admin', label: 'Admin Only' },
  ];

  const datePresets = [
    { label: 'Last 7 days', value: 7 },
    { label: 'This month', value: 30 },
    { label: 'This year', value: 365 },
  ];

  const downloadFilters = [
    { value: 'popular', label: 'Popular (>50 downloads)' },
    { value: 'recent', label: 'Recently downloaded' },
    { value: 'rare', label: 'Rarely accessed (<5 downloads)' },
  ];

  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    const newFileTypes = checked 
      ? [...filters.fileTypes, fileType]
      : filters.fileTypes.filter(t => t !== fileType);
    
    onFiltersChange({ ...filters, fileTypes: newFileTypes });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleAccessLevelChange = (level: string, checked: boolean) => {
    const newAccessLevels = checked 
      ? [...filters.accessLevel, level]
      : filters.accessLevel.filter(l => l !== level);
    
    onFiltersChange({ ...filters, accessLevel: newAccessLevels });
  };

  const handleDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onFiltersChange({ 
      ...filters, 
      dateRange: { start, end } 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.fileTypes.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.uploadedBy.length > 0) count++;
    if (filters.accessLevel.length > 0) count++;
    if (filters.fileSizeRange[0] > 0 || filters.fileSizeRange[1] < 100) count++;
    if (filters.downloadCountFilter) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Advanced Search</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {getActiveFiltersCount()} filters active
          </span>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Range Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              {datePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDatePreset(preset.value)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">From</Label>
                <Input 
                  type="date" 
                  className="text-xs"
                  value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { 
                      ...filters.dateRange, 
                      start: e.target.value ? new Date(e.target.value) : null 
                    }
                  })}
                />
              </div>
              <div>
                <Label className="text-xs">To</Label>
                <Input 
                  type="date" 
                  className="text-xs"
                  value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { 
                      ...filters.dateRange, 
                      end: e.target.value ? new Date(e.target.value) : null 
                    }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Type Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <FileType className="h-4 w-4 mr-2" />
              File Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fileTypes.map((fileType) => (
              <div key={fileType.value} className="flex items-center space-x-2">
                <Checkbox
                  id={fileType.value}
                  checked={filters.fileTypes.includes(fileType.value)}
                  onCheckedChange={(checked) => 
                    handleFileTypeChange(fileType.value, checked as boolean)
                  }
                />
                <Label htmlFor={fileType.value} className="text-sm flex items-center">
                  <span className="mr-2">{fileType.icon}</span>
                  {fileType.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={category} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Access Level Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Access Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {accessLevels.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <Checkbox
                  id={level.value}
                  checked={filters.accessLevel.includes(level.value)}
                  onCheckedChange={(checked) => 
                    handleAccessLevelChange(level.value, checked as boolean)
                  }
                />
                <Label htmlFor={level.value} className="text-sm">
                  {level.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* File Size Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              File Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="px-2">
              <Slider
                value={filters.fileSizeRange}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, fileSizeRange: value as [number, number] })
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{filters.fileSizeRange[0]} KB</span>
              <span>{filters.fileSizeRange[1]} MB</span>
            </div>
          </CardContent>
        </Card>

        {/* Download Count Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Download Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={filters.downloadCountFilter}
              onValueChange={(value) => 
                onFiltersChange({ ...filters, downloadCountFilter: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {downloadFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
