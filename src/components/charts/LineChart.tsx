import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  formatValue?: (value: number) => string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = '#3b82f6',
  showGrid = true,
  showLabels = true,
  formatValue: _formatValue = (v) => v.toString(),
}) => {
  if (data.length === 0) return null;

  const width = 100;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value)) || 1;
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1 || 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1]?.x || 0} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  // Grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    y: padding.top + chartHeight * (1 - ratio),
    value: minValue + range * ratio,
  }));

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={width - padding.right}
              y2={line.y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          </g>
        ))}

        {/* Area fill */}
        <path
          d={areaD}
          fill={`url(#gradient-${color})`}
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="white"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-200 hover:r-4"
          />
        ))}

        {/* X-axis labels */}
        {showLabels && points.map((p, i) => (
          i % Math.ceil(points.length / 6) === 0 || i === points.length - 1 ? (
            <text
              key={i}
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500"
              style={{ fontSize: '8px' }}
            >
              {p.label}
            </text>
          ) : null
        ))}
      </svg>
    </div>
  );
};
