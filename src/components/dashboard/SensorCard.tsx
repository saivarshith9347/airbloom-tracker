import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
}

const variantStyles = {
  default: "border-border",
  success: "border-success/30 glow-primary",
  warning: "border-warning/30 glow-warning",
  danger: "border-danger/30 glow-danger",
};

const iconBg = {
  default: "bg-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function SensorCard({ title, value, unit, icon, variant = "default", subtitle }: SensorCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 transition-all duration-300 animate-slide-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight text-card-foreground">{value}</span>
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5", iconBg[variant])}>{icon}</div>
      </div>
    </div>
  );
}
