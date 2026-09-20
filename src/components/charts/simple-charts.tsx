"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function SimpleLineChart({
  data,
  color = "#0D7C7F",
  height = 180,
  valuePrefix = "",
  valueSuffix = "",
}: LineChartProps) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const minVal = 0;
  const range = maxVal - minVal;

  const width = 500;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`line-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding - ratio * chartHeight;
          return (
            <line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(107, 114, 128, 0.15)"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Shaded Area */}
        <path d={areaD} fill={`url(#line-grad-${color.replace('#', '')})`} />

        {/* Line Stroke */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Circles & Labels */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
              className="transition-all duration-200 group-hover:r-6"
            />
            {/* Value tooltip on hover */}
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold fill-neutral-dark"
            >
              {valuePrefix}{p.value.toLocaleString()}{valueSuffix}
            </text>
            {/* X-axis labels */}
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="text-[10px] font-mono fill-neutral-gray"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

interface TierBarProps {
  tier5: number;
  tier4: number;
  tier3: number;
}

export function PrizePoolTierBar({ tier5, tier4, tier3 }: TierBarProps) {
  const total = tier5 + tier4 + tier3 || 1;
  const p5 = Math.round((tier5 / total) * 100);
  const p4 = Math.round((tier4 / total) * 100);
  const p3 = Math.round((tier3 / total) * 100);

  return (
    <div className="space-y-3">
      {/* Progress Bar Track */}
      <div className="h-4 w-full bg-neutral-light rounded-full overflow-hidden flex shadow-inner">
        <div style={{ width: `${p5}%` }} className="bg-gold h-full transition-all duration-500" title={`5-Match: ${p5}%`} />
        <div style={{ width: `${p4}%` }} className="bg-primary h-full transition-all duration-500" title={`4-Match: ${p4}%`} />
        <div style={{ width: `${p3}%` }} className="bg-charity h-full transition-all duration-500" title={`3-Match: ${p3}%`} />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0"></span>
          <div>
            <div className="font-semibold text-neutral-dark">5-Match (40%)</div>
            <div className="text-[11px] font-mono text-neutral-gray">{formatCurrency(tier5)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
          <div>
            <div className="font-semibold text-neutral-dark">4-Match (35%)</div>
            <div className="text-[11px] font-mono text-neutral-gray">{formatCurrency(tier4)}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-charity shrink-0"></span>
          <div>
            <div className="font-semibold text-neutral-dark">3-Match (25%)</div>
            <div className="text-[11px] font-mono text-neutral-gray">{formatCurrency(tier3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharityShareDonut({
  shares,
}: {
  shares: { name: string; amount: number; color: string }[];
}) {
  const total = shares.reduce((acc, s) => acc + s.amount, 0) || 1;
  let accumulated = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {shares.map((s, i) => {
            const percent = (s.amount / total) * 100;
            const strokeDasharray = `${percent} ${100 - percent}`;
            const strokeDashoffset = -accumulated;
            accumulated += percent;

            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={s.color}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] uppercase font-mono text-neutral-gray">Raised</span>
          <span className="text-xs font-bold font-mono text-neutral-dark">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 w-full">
        {shares.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="truncate text-neutral-dark font-medium">{s.name}</span>
            </div>
            <span className="font-mono text-neutral-gray font-semibold shrink-0">
              {formatCurrency(s.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
