import { useState, useMemo, useEffect } from "react";
import { SensorReading, getAqiLevel, exportReadingsToCsv, AqiColor } from "@/lib/thingspeak";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

interface HistoryTableProps {
  data: SensorReading[];
  pageSize?: number;
}

const colorMap: Record<AqiColor, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  default: "text-foreground",
};

export function HistoryTable({ data, pageSize: propsPageSize }: HistoryTableProps) {
  const [page, setPage] = useState(0);
  const pageSize = propsPageSize ?? 25;
  
  const sorted = useMemo(() => [...data].reverse(), [data]);
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = useMemo(
    () => sorted.slice(page * pageSize, (page + 1) * pageSize),
    [sorted, page, pageSize]
  );

  // Reset page to 0 when data changes
  useEffect(() => setPage(0), [data]);

  return (
    <div className="rounded-lg border border-border bg-card animate-slide-in">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-sm font-medium text-muted-foreground">History & Logs</h3>
        <button
          onClick={() => exportReadingsToCsv(data)}
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
            {pageData.map((r) => {
              const level = getAqiLevel(r.aqi);
              return (
                <tr key={r.timestamp} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
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
      
      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
        <span>
          Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-secondary/30 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded border border-border disabled:opacity-40 hover:bg-secondary/30 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
