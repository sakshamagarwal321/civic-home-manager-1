
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Upload, Download, Clock } from 'lucide-react';

export const DocumentStatsBar: React.FC = () => {
  const storageUsed = 2.8;
  const storageTotal = 5.0;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HardDrive className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Storage Used</p>
              <p className="text-xs text-muted-foreground">
                {storageUsed} GB of {storageTotal} GB
              </p>
              <Progress value={storagePercentage} className="mt-1 h-2" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Documents This Month</p>
              <p className="text-2xl font-bold text-green-600">15</p>
              <p className="text-xs text-muted-foreground">new uploads</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Most Downloaded</p>
              <p className="text-sm font-semibold">AGM Minutes Feb 2024</p>
              <p className="text-xs text-muted-foreground">45 downloads</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Pending Reviews</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-xs text-muted-foreground">awaiting approval</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
