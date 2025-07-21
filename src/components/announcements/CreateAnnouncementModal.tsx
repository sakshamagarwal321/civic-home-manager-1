
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Calendar, 
  Users, 
  Bell, 
  Hash, 
  X 
} from 'lucide-react';

interface CreateAnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (announcement: any) => void;
  isAlert?: boolean;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isAlert = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'medium',
    requiresRsvp: false,
    schedulePost: false,
    scheduledDate: '',
    scheduledTime: '',
    sendNotification: true,
    tags: [] as string[],
    attachment: null as File | null
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'medium',
      requiresRsvp: false,
      schedulePost: false,
      scheduledDate: '',
      scheduledTime: '',
      sendNotification: true,
      tags: [],
      attachment: null
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {isAlert ? (
              <>
                <Bell className="h-5 w-5 mr-2 text-red-500" />
                Send Alert
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 mr-2" />
                New Announcement
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter announcement content"
              rows={4}
              required
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <RadioGroup
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">Urgent</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Hash className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rsvp"
                checked={formData.requiresRsvp}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, requiresRsvp: checked as boolean }))
                }
              />
              <Label htmlFor="rsvp" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Requires RSVP
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="schedule"
                checked={formData.schedulePost}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, schedulePost: checked as boolean }))
                }
              />
              <Label htmlFor="schedule" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </Label>
            </div>

            {formData.schedulePost && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification"
                checked={formData.sendNotification}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, sendNotification: checked as boolean }))
                }
              />
              <Label htmlFor="notification" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Send Push Notification
              </Label>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attachment</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, JPG, PNG (max 10MB)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className={isAlert ? 'bg-red-600 hover:bg-red-700' : ''}>
              {isAlert ? 'Send Alert' : 'Publish Announcement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
