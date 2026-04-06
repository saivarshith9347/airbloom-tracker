import { Activity, ChevronDown } from "lucide-react";
import { DeviceInfo } from "@/lib/thingspeak";

interface DashboardHeaderProps {
  devices: DeviceInfo[];
  selectedDevice: string;
  onDeviceChange: (id: string) => void;
  lastUpdated: string | null;
}

export function DashboardHeader({ devices, selectedDevice, onDeviceChange, lastUpdated }: DashboardHeaderProps) {
  const current = devices.find((d) => d.id === selectedDevice);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Air Monitor</h1>
          <p className="text-xs text-muted-foreground">
            IoT Environmental Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Device selector */}
        <div className="relative">
          <select
            value={selectedDevice}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="appearance-none bg-secondary text-secondary-foreground text-sm rounded-lg px-3 py-2 pr-8 border border-border focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
        {/* Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${current?.online ? "bg-success animate-pulse-glow" : "bg-muted-foreground"}`} />
          <span className="text-muted-foreground">{current?.online ? "Online" : "Offline"}</span>
        </div>
        {lastUpdated && (
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
            {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
    </header>
  );
}
