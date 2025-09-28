import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = ({ title }: { title?: string }) => {
  return (
    <Card>
      <CardHeader>
        {title ? (
          <div className="text-lg font-semibold">{title}</div>
        ) : (
          <Skeleton className="h-6 w-48" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Chart area skeleton */}
          <div className="h-[300px] flex items-end justify-between gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton 
                  className="w-full" 
                  style={{ height: `${Math.random() * 200 + 50}px` }}
                />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
          
          {/* Legend skeleton */}
          <div className="flex justify-center gap-4 mt-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;