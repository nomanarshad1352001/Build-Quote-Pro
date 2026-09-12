import React from 'react';

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 180,
  strokeWidth = 24,
  centerLabel,
  centerValue,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  const segments = data.map((item) => {
    const percentage = item.value / total;
    const strokeDasharray = `${circumference * percentage} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += circumference * percentage;

    return {
      ...item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-700"
        />
        
        {/* Data segments */}
        {segments.map((segment, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={segment.strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        ))}
      </svg>

      {/* Center content */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Legend component for donut chart
export const DonutLegend: React.FC<{ data: DonutData[] }> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {item.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {item.value}
            </span>
            <span className="text-xs text-slate-400">
              ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
