import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Download, Filter, Calendar } from "lucide-react";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { useAirMonitor } from "@/hooks/useAirMonitor";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { exportReadingsToCsv } from "@/lib/thingspeak";

export default function History() {
  const { readings, filterHours, setFilterHours } = useAirMonitor({ enableLivePolling: false });

  const handleExport = () => {
    exportReadingsToCsv(readings);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <HistoryIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">History & Logs</h1>
            <p className="text-muted-foreground">View and export historical sensor data</p>
          </div>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{readings.length}</p>
              </div>
              <HistoryIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Range</p>
                <p className="text-2xl font-bold">{filterHours}h</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg AQI</p>
                <p className="text-2xl font-bold">
                  {readings.length > 0
                    ? Math.round(readings.reduce((sum, r) => sum + r.aqi, 0) / readings.length)
                    : 0}
                </p>
              </div>
              <Filter className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Logs</CardTitle>
              <CardDescription>Historical sensor readings and measurements</CardDescription>
            </div>
            <TimeFilter value={filterHours} onChange={setFilterHours} />
          </div>
        </CardHeader>
        <CardContent>
          <HistoryTable data={readings} />
        </CardContent>
      </Card>
    </div>
  );
}
