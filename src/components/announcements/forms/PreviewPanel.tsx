
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  Smartphone, 
  Users, 
  Clock, 
  CheckCircle,
  Globe,
  BarChart3
} from 'lucide-react';

interface PreviewPanelProps {
  formData: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ formData }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Emergency': return '🚨';
      case 'Events': return '🎉';
      case 'Financial': return '💰';
      case 'Maintenance': return '🔧';
      default: return '📢';
    }
  };

  const estimateDelivery = () => {
    const baseResidents = 150;
    let audienceMultiplier = 1;
    
    if (formData.targetAudience.includes('owners')) audienceMultiplier = 0.7;
    if (formData.targetAudience.includes('tenants')) audienceMultiplier = 0.3;
    if (formData.targetAudience.includes('committee')) audienceMultiplier = 0.1;
    
    return Math.round(baseResidents * audienceMultiplier);
  };

  const estimateEngagement = () => {
    const basePriority = {
      low: 0.4,
      normal: 0.6,
      high: 0.8,
      urgent: 0.95
    };
    
    return Math.round((basePriority[formData.priority as keyof typeof basePriority] || 0.6) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview & Review</h3>
        <Tabs defaultValue="desktop" className="w-fit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile">
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="desktop" className="w-full">
        <TabsContent value="desktop" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(formData.category)}</span>
                  <Badge className={getPriorityColor(formData.priority)}>
                    {formData.priority}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">Just now</span>
              </div>
              <CardTitle className="text-xl">{formData.title || 'Announcement Title'}</CardTitle>
              <p className="text-sm text-muted-foreground">
                By Management Committee • {formData.category} • 
                {formData.targetAudience.length > 0 ? ` ${formData.targetAudience.join(', ')}` : ' All Residents'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">
                  {formData.content || 'Your announcement content will appear here...'}
                </p>
              </div>
              {formData.interactiveFeatures.includes('rsvp') && (
                <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                  <p className="text-sm font-medium mb-2">RSVP Required</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Attending</Button>
                    <Button size="sm" variant="outline">Not Attending</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mobile" className="space-y-4">
          <Card className="max-w-sm mx-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(formData.priority)} variant="secondary">
                  {formData.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <CardTitle className="text-lg">{formData.title || 'Announcement Title'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {formData.content || 'Your announcement content will appear here...'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analytics & Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Delivery Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-2xl font-bold">{estimateDelivery()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Recipients</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-2xl font-bold">{estimateEngagement()}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Est. Engagement</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Readability Score</span>
              <span className="font-medium">Good</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Estimated Reading Time</span>
              <span className="font-medium">
                {Math.ceil(formData.content.split(/\s+/).length / 200)} min
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Compliance Check</span>
              <span className="font-medium text-green-600">✓ Passed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-language Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Multi-language Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>English (Primary)</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Hindi</span>
              <Button variant="outline" size="sm">Auto-translate</Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Regional Language</span>
              <Button variant="outline" size="sm">Auto-translate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
