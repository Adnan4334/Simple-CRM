import { CustomerStatus } from '@/types/crm';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'status-new' },
  contacted: { label: 'Contacted', className: 'status-contacted' },
  interested: { label: 'Interested', className: 'status-interested' },
  closed: { label: 'Closed', className: 'status-closed' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
