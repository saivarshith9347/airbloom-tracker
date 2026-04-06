import { Thermometer, Droplets, Wind } from "lucide-react";
import { useAirMonitor } from "@/hooks/useAirMonitor";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { AqiGauge } from "@/components/dashboard/AqiGauge";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { getAqiLevel } from "@/lib/thingspeak";

const Index = () => {
  const {
    readings, latest, devices, selectedDevice, setSelectedDevice,
    filterHours, setFilterHours, alerts, clearAlerts,
  } = useAirMonitor();

  const aqiLevel = latest ? getAqiLevel(latest.aqi) : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <DashboardHeader
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
          lastUpdated={latest?.timestamp ?? null}
        />

        <AlertBanner alerts={alerts} onClear={clearAlerts} />

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            title="Temperature"
            value={latest ? latest.temperature.toFixed(1) : "--"}
            unit="°C"
            icon={<Thermometer className="h-5 w-5" />}
            variant="default"
          />
          <SensorCard
            title="Humidity"
            value={latest ? latest.humidity.toFixed(1) : "--"}
            unit="%"
            icon={<Droplets className="h-5 w-5" />}
            variant="default"
          />
          <SensorCard
            title="Air Quality"
            value={latest ? Math.round(latest.aqi) : "--"}
            unit="AQI"
            icon={<Wind className="h-5 w-5" />}
            variant={aqiLevel?.color ?? "default"}
            subtitle={aqiLevel?.label}
          />
          <AqiGauge aqi={latest?.aqi ?? 0} />
        </div>

        {/* Charts + Map */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Analytics</h2>
          <TimeFilter value={filterHours} onChange={setFilterHours} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SensorChart
            data={readings}
            dataKey="temperature"
            title="Temperature vs Time"
            color="hsl(200, 80%, 50%)"
            unit="°"
          />
          <SensorChart
            data={readings}
            dataKey="aqi"
            title="AQI vs Time"
            color="hsl(160, 84%, 39%)"
            unit=""
          />
        </div>

        <LiveMap readings={readings} latest={latest} />

        <HistoryTable data={readings} />
      </div>
    </div>
  );
};

export default Index;
