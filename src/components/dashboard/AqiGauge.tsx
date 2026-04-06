import { getAqiLevel } from "@/lib/thingspeak";
import { cn } from "@/lib/utils";

interface AqiGaugeProps {
  aqi: number;
}

const colorMap = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const bgMap = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function AqiGauge({ aqi }: AqiGaugeProps) {
  const level = getAqiLevel(aqi);
  const pct = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-slide-in">
      <p className="text-sm font-medium text-muted-foreground mb-3">Air Quality Index</p>
      <div className="flex items-end gap-3 mb-3">
        <span className={cn("text-4xl font-bold tracking-tight", colorMap[level.color])}>
          {Math.round(aqi)}
        </span>
        <span className={cn("text-sm font-semibold mb-1 px-2 py-0.5 rounded-full", bgMap[level.color], "text-background")}>
          {level.label}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bgMap[level.color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{level.description}</p>
    </div>
  );
}
