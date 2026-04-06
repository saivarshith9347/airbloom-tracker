import { AlertTriangle, X } from "lucide-react";

interface Alert {
  message: string;
  timestamp: string;
  aqi: number;
}

interface AlertBannerProps {
  alerts: Alert[];
  onClear: () => void;
}

export function AlertBanner({ alerts, onClear }: AlertBannerProps) {
  if (!alerts.length) return null;

  const latest = alerts[0];
  return (
    <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 flex items-center gap-3 animate-slide-in glow-danger">
      <AlertTriangle className="h-5 w-5 text-danger shrink-0 animate-pulse-glow" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-danger">{latest.message}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(latest.timestamp).toLocaleString()} · {alerts.length} alert{alerts.length > 1 ? "s" : ""} total
        </p>
      </div>
      <button onClick={onClear} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
