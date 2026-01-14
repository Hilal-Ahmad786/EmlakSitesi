'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
}

export function SimpleLineChart({ data, title, color = '#1a2b4b', height = 200 }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (100 - padding * 2);
    const y = 100 - padding - ((d.value - minValue) / range) * (100 - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = 100 - padding - (percent / 100) * (100 - padding * 2);
            return (
              <line
                key={percent}
                x1={padding}
                y1={y}
                x2={100 - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.2"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill={`${color}10`} />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 1.5 : 0.8}
              fill={color}
              className="transition-all cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
      {hoveredIndex !== null && (
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-900">
            {data[hoveredIndex].label}: {data[hoveredIndex].value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

interface BarChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

export function SimpleBarChart({ data, title, color = '#1a2b4b' }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function SimplePieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const segments = data.map((d) => {
    const percentage = d.value / total;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage * 360;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = percentage > 0.5 ? 1 : 0;

    return {
      ...d,
      percentage,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((segment, i) => (
              <path
                key={i}
                d={segment.path}
                fill={segment.color}
                className="transition-opacity hover:opacity-80"
              />
            ))}
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm text-gray-600 flex-1">{segment.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {(segment.percentage * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface FunnelChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function FunnelChart({ data, title }: FunnelChartProps) {
  const maxValue = data[0]?.value || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;
          const conversionRate = index > 0
            ? ((item.value / data[index - 1].value) * 100).toFixed(1)
            : null;

          return (
            <div key={index} className="relative">
              <div
                className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                style={{
                  width: `${Math.max(widthPercent, 30)}%`,
                  backgroundColor: item.color,
                  marginLeft: `${(100 - Math.max(widthPercent, 30)) / 2}%`,
                }}
              >
                <span className="text-white font-medium text-sm">{item.label}</span>
                <span className="text-white font-bold">{item.value.toLocaleString()}</span>
              </div>
              {conversionRate && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {conversionRate}% conversion
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const options = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
  ];

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
