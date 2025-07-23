
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  FileText, 
  Users, 
  CreditCard, 
  Building, 
  Wrench, 
  Megaphone,
  Clock,
  Star,
  X
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  module: string;
  type: string;
  url: string;
  timestamp?: Date;
  relevance: number;
  metadata?: any;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimeout = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimeout);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  };

  const loadSuggestions = () => {
    // Role-based suggestions
    const roleSuggestions = [
      'payment due',
      'maintenance requests',
      'facility bookings',
      'announcements',
      'committee members',
      'financial reports',
      'emergency contacts'
    ];
    setSuggestions(roleSuggestions);
  };

  const performSearch = async (query: string) => {
    setLoading(true);
    
    try {
      // Mock search results - in real implementation, this would call API
      const mockResults: SearchResult[] = [
        // Financial results
        {
          id: '1',
          title: 'Monthly Maintenance Payment - December 2024',
          description: 'Payment of ₹2,500 due on Dec 5, 2024',
          module: 'finances',
          type: 'payment',
          url: '/finances',
          relevance: 0.95,
          metadata: { amount: 2500, dueDate: '2024-12-05' }
        },
        {
          id: '2',
          title: 'Elevator Maintenance Expense',
          description: 'Monthly elevator servicing - ₹8,000',
          module: 'finances',
          type: 'expense',
          url: '/finances',
          relevance: 0.88,
          metadata: { amount: 8000, category: 'maintenance' }
        },
        
        // Member results
        {
          id: '3',
          title: 'Priya Sharma - A-204',
          description: 'Resident Owner, Committee Member',
          module: 'members',
          type: 'resident',
          url: '/members',
          relevance: 0.82,
          metadata: { flat: 'A-204', role: 'committee_member' }
        },
        
        // Maintenance results
        {
          id: '4',
          title: 'Plumbing Issue - Kitchen Sink',
          description: 'Reported by resident A-301, Status: In Progress',
          module: 'maintenance',
          type: 'request',
          url: '/maintenance',
          relevance: 0.75,
          metadata: { status: 'in_progress', flat: 'A-301' }
        },
        
        // Facility results
        {
          id: '5',
          title: 'Community Hall Booking',
          description: 'Birthday party booking for Dec 25, 2024',
          module: 'facilities',
          type: 'booking',
          url: '/facilities',
          relevance: 0.70,
          metadata: { date: '2024-12-25', facility: 'community_hall' }
        },
        
        // Document results
        {
          id: '6',
          title: 'AGM Minutes - November 2024',
          description: 'Annual General Meeting proceedings and decisions',
          module: 'documents',
          type: 'meeting_minutes',
          url: '/documents',
          relevance: 0.68,
          metadata: { date: '2024-11-15', type: 'agm' }
        },
        
        // Announcement results
        {
          id: '7',
          title: 'Water Supply Maintenance Notice',
          description: 'Scheduled maintenance on Dec 20, 2024',
          module: 'announcements',
          type: 'notice',
          url: '/announcements',
          relevance: 0.65,
          metadata: { date: '2024-12-20', category: 'maintenance' }
        }
      ];

      // Filter results based on search term
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.module.toLowerCase().includes(query.toLowerCase())
      );

      // Sort by relevance
      filteredResults.sort((a, b) => b.relevance - a.relevance);

      setResults(filteredResults);
      saveRecentSearch(query);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (query: string) => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [query, ...recent.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'finances':
        return <CreditCard className="h-4 w-4" />;
      case 'members':
        return <Users className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      case 'facilities':
        return <Building className="h-4 w-4" />;
      case 'documents':
        return <FileText className="h-4 w-4" />;
      case 'announcements':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    window.location.href = result.url;
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <Card className="w-full max-w-3xl mx-4 max-h-[70vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search across all modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Recent Searches and Suggestions */}
            {!searchTerm && (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm font-medium">Recent Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {loading && (
              <div className="text-center py-8 text-muted-foreground">
                Searching...
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-sm text-muted-foreground mb-2">
                  {results.length} results found
                </div>
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getModuleIcon(result.module)}
                          <span className="font-medium text-sm">
                            {result.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {result.module}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {result.description}
                        </p>
                        {result.metadata && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {result.metadata.amount && (
                              <span>Amount: ₹{result.metadata.amount}</span>
                            )}
                            {result.metadata.date && (
                              <span>Date: {result.metadata.date}</span>
                            )}
                            {result.metadata.status && (
                              <Badge variant="secondary" className="text-xs">
                                {result.metadata.status}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(result.relevance * 100)}% match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && results.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
