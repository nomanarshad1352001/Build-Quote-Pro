import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
  className?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    trend: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    trend: 'text-purple-600 dark:text-purple-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    trend: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    icon: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
    trend: 'text-rose-600 dark:text-rose-400',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-800',
    icon: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
    trend: 'text-slate-600 dark:text-slate-400',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = 'blue',
  className,
}) => {
  const styles = colorStyles[color];
  const trendIsPositive = trend && trend.value > 0;
  const trendIsNegative = trend && trend.value < 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-all duration-200 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600',
        className
      )}
    >
      {/* Background decoration */}
      <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-50', styles.bg)} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {value}
            </p>
          </div>
          <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', styles.icon)}>
            {icon}
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <div
              className={cn(
                'flex items-center gap-0.5 text-sm font-medium',
                trendIsPositive && 'text-emerald-600 dark:text-emerald-400',
                trendIsNegative && 'text-rose-600 dark:text-rose-400',
                !trendIsPositive && !trendIsNegative && 'text-slate-500 dark:text-slate-400'
              )}
            >
              {trendIsPositive ? (
                <TrendingUp size={16} />
              ) : trendIsNegative ? (
                <TrendingDown size={16} />
              ) : (
                <Minus size={16} />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
