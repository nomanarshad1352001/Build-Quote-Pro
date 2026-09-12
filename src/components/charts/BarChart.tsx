import React from 'react';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  showValues?: boolean;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  horizontal = false,
}) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value)) || 1;

  if (horizontal) {
    return (
      <div className="space-y-3" style={{ minHeight: height }}>
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
              {showValues && (
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </span>
              )}
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3b82f6',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2 px-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center" style={{ height: height - 40 }}>
            {showValues && (
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {item.value}
              </span>
            )}
            <div
              className="w-full max-w-12 rounded-t-lg transition-all duration-500 ease-out"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3b82f6',
                minHeight: item.value > 0 ? '4px' : '0',
              }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 text-center truncate w-full">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
