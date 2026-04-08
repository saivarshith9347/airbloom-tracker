import { getAqiLevel } from "@/lib/thingspeak";
import { cn } from "@/lib/utils";

interface AqiGaugeProps {
  aqi: number;
}

const colorMap = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  default: "text-muted-foreground",
};

const bgMap = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  default: "bg-muted",
};

// AQI color bands for the gauge
function getAqiBandColor(aqi: number): string {
  if (aqi <= 50) return "#00e400";   // Good - green
  if (aqi <= 100) return "#ffff00";  // Moderate - yellow
  if (aqi <= 150) return "#ff7e00";  // Unhealthy for Sensitive - orange
  if (aqi <= 200) return "#ff0000";  // Unhealthy - red
  if (aqi <= 300) return "#8f3f97";  // Very Unhealthy - purple
  return "#7e0023";                   // Hazardous - maroon
}

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
      
      {/* 6-band gradient gauge */}
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{
        background: "linear-gradient(to right, #00e400 0%, #00e400 16.67%, #ffff00 16.67%, #ffff00 33.33%, #ff7e00 33.33%, #ff7e00 50%, #ff0000 50%, #ff0000 66.67%, #8f3f97 66.67%, #8f3f97 83.33%, #7e0023 83.33%, #7e0023 100%)"
      }}>
        <div className="h-full relative">
          <div 
            className="absolute top-0 left-0 h-full w-1 bg-background shadow-lg"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">{level.description}</p>
    </div>
  );
}
