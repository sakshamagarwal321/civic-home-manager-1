
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FileText, Calendar, IndianRupee, Scale, Bell, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface DocumentCategory {
  id: string;
  name: string;
  count: number;
  icon: any;
  children?: DocumentCategory[];
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'all',
    name: 'All Documents',
    count: 127,
    icon: Folder,
  },
  {
    id: 'bylaws',
    name: 'Society Bylaws',
    count: 8,
    icon: FileText,
    children: [
      { id: 'original-bylaws', name: 'Original Bylaws (2018)', count: 1, icon: FileText },
      { id: 'amendment-1', name: 'Amendment 1 (2020)', count: 1, icon: FileText },
      { id: 'amendment-2', name: 'Amendment 2 (2023)', count: 1, icon: FileText },
    ],
  },
  {
    id: 'minutes',
    name: 'Meeting Minutes',
    count: 24,
    icon: Calendar,
    children: [
      { id: 'agm-minutes', name: 'AGM Minutes', count: 6, icon: Calendar },
      { id: 'committee-meetings', name: 'Committee Meetings', count: 18, icon: Calendar },
    ],
  },
  {
    id: 'financial',
    name: 'Financial Records',
    count: 32,
    icon: IndianRupee,
    children: [
      { id: 'budgets', name: 'Annual Budgets', count: 5, icon: IndianRupee },
      { id: 'audit-reports', name: 'Audit Reports', count: 8, icon: IndianRupee },
      { id: 'tax-documents', name: 'Tax Documents', count: 12, icon: IndianRupee },
      { id: 'bank-statements', name: 'Bank Statements', count: 7, icon: IndianRupee },
    ],
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    count: 15,
    icon: Scale,
    children: [
      { id: 'registration', name: 'Registration Certificate', count: 1, icon: Scale },
      { id: 'noc', name: 'NOC Documents', count: 4, icon: Scale },
      { id: 'insurance', name: 'Insurance Policies', count: 3, icon: Scale },
      { id: 'contracts', name: 'Contracts', count: 7, icon: Scale },
    ],
  },
  {
    id: 'notices',
    name: 'Notices & Circulars',
    count: 28,
    icon: Bell,
    children: [
      { id: 'govt-notices', name: 'Government Notices', count: 12, icon: Bell },
      { id: 'society-notices', name: 'Society Notices', count: 16, icon: Bell },
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance Records',
    count: 20,
    icon: Wrench,
    children: [
      { id: 'warranties', name: 'Equipment Warranties', count: 8, icon: Wrench },
      { id: 'service-agreements', name: 'Service Agreements', count: 12, icon: Wrench },
    ],
  },
];

interface DocumentsSidebarProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const DocumentsSidebar: React.FC<DocumentsSidebarProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['all']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const renderCategory = (category: DocumentCategory, level: number = 0) => {
    const Icon = category.icon;
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategory === category.id;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id} className={cn("w-full", level > 0 && "ml-4")}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
          <div className="flex items-center">
            {hasChildren && (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 hover:bg-transparent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
            <Button
              variant="ghost"
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                "flex-1 justify-start px-2 py-1 h-auto font-normal",
                isSelected && "bg-primary/10 text-primary font-medium",
                !hasChildren && "ml-6"
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">{category.name}</span>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </Button>
          </div>
          {hasChildren && (
            <CollapsibleContent className="mt-1 space-y-1">
              {category.children?.map(child => renderCategory(child, level + 1))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="w-80 bg-card border-r border-border p-4 space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground mb-4">DOCUMENT CATEGORIES</h3>
      {documentCategories.map(category => renderCategory(category))}
    </div>
  );
};
