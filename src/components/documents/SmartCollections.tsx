
import React from 'react';
import { TrendingUp, Plus, Star, RotateCcw, Users, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SmartCollection {
  id: string;
  name: string;
  description: string;
  icon: any;
  count: number;
  color: string;
  isSystem: boolean;
}

const systemCollections: SmartCollection[] = [
  {
    id: 'trending',
    name: 'Trending Documents',
    description: 'Most accessed this week',
    icon: TrendingUp,
    count: 12,
    color: 'bg-blue-100 text-blue-700',
    isSystem: true,
  },
  {
    id: 'recent',
    name: 'Recent Uploads',
    description: 'Last 30 days',
    icon: Plus,
    count: 24,
    color: 'bg-green-100 text-green-700',
    isSystem: true,
  },
  {
    id: 'essential',
    name: 'Essential Documents',
    description: 'High-priority society documents',
    icon: Star,
    count: 8,
    color: 'bg-yellow-100 text-yellow-700',
    isSystem: true,
  },
  {
    id: 'review',
    name: 'Due for Review',
    description: 'Documents with review dates',
    icon: RotateCcw,
    count: 5,
    color: 'bg-orange-100 text-orange-700',
    isSystem: true,
  },
  {
    id: 'committee',
    name: 'Committee Resources',
    description: 'Restricted access materials',
    icon: Users,
    count: 18,
    color: 'bg-purple-100 text-purple-700',
    isSystem: true,
  },
  {
    id: 'handbook',
    name: 'Resident Handbook',
    description: 'Commonly referenced guides',
    icon: BookOpen,
    count: 15,
    color: 'bg-indigo-100 text-indigo-700',
    isSystem: true,
  },
];

interface SmartCollectionsProps {
  onCollectionClick: (collection: SmartCollection) => void;
  customCollections?: SmartCollection[];
}

export const SmartCollections: React.FC<SmartCollectionsProps> = ({
  onCollectionClick,
  customCollections = [],
}) => {
  const allCollections = [...systemCollections, ...customCollections];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Smart Collections</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCollections.map((collection) => {
          const Icon = collection.icon;
          return (
            <Card 
              key={collection.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onCollectionClick(collection)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${collection.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {collection.count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-sm mb-1">{collection.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{collection.description}</p>
                {collection.isSystem && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Auto-generated
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
