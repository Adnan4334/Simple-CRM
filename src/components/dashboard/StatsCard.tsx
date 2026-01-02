import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: number; positive: boolean };
}

export function StatsCard({ title, value, icon: Icon, iconColor = 'text-primary' }: StatsCardProps) {
  return (
    <Card className="shadow-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn('p-3 rounded-xl bg-accent', iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
