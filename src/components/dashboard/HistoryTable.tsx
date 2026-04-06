import { SensorReading, getAqiLevel } from "@/lib/thingspeak";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

interface HistoryTableProps {
  data: SensorReading[];
}

const colorMap = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function exportCsv(data: SensorReading[]) {
  const header = "Timestamp,Temperature(°C),Humidity(%),AQI,Latitude,Longitude\n";
  const rows = data
    .map(
      (r) =>
        `${r.timestamp},${r.temperature.toFixed(1)},${r.humidity.toFixed(1)},${Math.round(r.aqi)},${r.latitude.toFixed(5)},${r.longitude.toFixed(5)}`
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `air-monitor-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function HistoryTable({ data }: HistoryTableProps) {
  const recent = [...data].reverse().slice(0, 50);

  return (
    <div className="rounded-lg border border-border bg-card animate-slide-in">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-sm font-medium text-muted-foreground">History & Logs</h3>
        <button
          onClick={() => exportCsv(data)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-border">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Time</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Temp</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Humidity</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">AQI</th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Location</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r, i) => {
              const level = getAqiLevel(r.aqi);
              return (
                <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-2 font-mono text-muted-foreground">
                    {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="px-4 py-2 text-card-foreground">{r.temperature.toFixed(1)}°C</td>
                  <td className="px-4 py-2 text-card-foreground">{r.humidity.toFixed(1)}%</td>
                  <td className={cn("px-4 py-2 font-semibold", colorMap[level.color])}>
                    {Math.round(r.aqi)}
                  </td>
                  <td className="px-4 py-2 font-mono text-muted-foreground hidden sm:table-cell">
                    {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
