import type { ReactNode } from "react";

interface DonutSegment {
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

// Radio fijo sobre un viewBox de 160x160 — no hace falta una librería de
// charts para un donut de una sola serie, es geometría de círculo simple
// (stroke-dasharray por segmento, en proporción a la circunferencia total).
const RADIUS = 65;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({ segments, size = 200, strokeWidth = 18, children }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let accumulated = 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 160 160" className="-rotate-90" style={{ width: size, height: size }}>
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="transparent"
          stroke="var(--color-surface-container)"
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((segment, i) => {
            const dash = (segment.value / total) * CIRCUMFERENCE;
            const dashOffset = -accumulated;
            accumulated += dash;
            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500"
              />
            );
          })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
