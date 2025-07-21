
import React from 'react';
import { Search, Filter, Grid3X3, List, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>All File Types</DropdownMenuItem>
            <DropdownMenuItem>PDF Documents</DropdownMenuItem>
            <DropdownMenuItem>Spreadsheets</DropdownMenuItem>
            <DropdownMenuItem>Word Documents</DropdownMenuItem>
            <DropdownMenuItem>Images</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort: {sortBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onSortChange('Name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Date')}>Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Size')}>Size</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Downloads')}>Downloads</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Category')}>Category</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
