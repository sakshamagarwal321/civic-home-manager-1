
import React, { useState } from 'react';
import { Search, Filter, Grid3X3, List, SortAsc, BarChart3, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  onAdvancedSearchToggle: () => void;
  onAnalyticsToggle: () => void;
  isAdvancedSearchOpen: boolean;
  activeFiltersCount: number;
  searchSuggestions?: string[];
}

export const DocumentSearchBar: React.FC<DocumentSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onAdvancedSearchToggle,
  onAnalyticsToggle,
  isAdvancedSearchOpen,
  activeFiltersCount,
  searchSuggestions = [],
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleSearchInputChange = (value: string) => {
    onSearchChange(value);
    setShowSuggestions(value.length > 0 && searchSuggestions.length > 0);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : searchSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onSearchChange(searchSuggestions[highlightedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search documents, content, or metadata..."
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(searchTerm.length > 0 && filteredSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10"
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-accent ${
                    index === highlightedIndex ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button
          variant={isAdvancedSearchOpen ? "default" : "outline"}
          size="sm"
          onClick={onAdvancedSearchToggle}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Search
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort: {sortBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onSortChange('Relevance')}>
              Relevance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Name')}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Date')}>
              Date Modified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Size')}>
              File Size
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Downloads')}>
              Downloads
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('Category')}>
              Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAnalyticsToggle}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        
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
