import React from 'react';
import { cn } from '@/utils/cn';
import type { QuotationStatus } from '@/types';

interface BadgeProps {
  status: QuotationStatus;
  className?: string;
}

const statusConfig: Record<QuotationStatus, { label: string; className: string }> = {
  draft: { 
    label: 'Draft', 
    className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' 
  },
  sent: { 
    label: 'Sent', 
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
  },
  accepted: { 
    label: 'Accepted', 
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
  },
  rejected: { 
    label: 'Rejected', 
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' 
  },
};

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'draft' && 'bg-slate-400',
        status === 'sent' && 'bg-blue-500',
        status === 'accepted' && 'bg-emerald-500',
        status === 'rejected' && 'bg-red-500',
      )} />
      {config.label}
    </span>
  );
};
