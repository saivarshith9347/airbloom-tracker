import { Thermometer, Droplets, Wind, Activity } from "lucide-react";
import { useAirMonitor } from "@/hooks/useAirMonitor";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { AqiGauge } from "@/components/dashboard/AqiGauge";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { EnhancedMap } from "@/components/dashboard/EnhancedMap";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { TimeFilter } from "@/components/dashboard/TimeFilter";
import { getAqiLevel } from "@/lib/thingspeak";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const [searchParams] = useSearchParams();
  const deviceParam = searchParams.get("device");

  const {
    readings, latest, devices, selectedDevice, setSelectedDevice,
    filterHours, setFilterHours, alerts, clearAlerts,
  } = useAirMonitor();

  useEffect(() => {
    if (deviceParam && devices.find((d) => d.id === deviceParam)) {
      setSelectedDevice(deviceParam);
    }
  }, [deviceParam, devices, setSelectedDevice]);

  const aqiLevel = latest ? getAqiLevel(latest.aqi) : null;
  const currentDevice = devices.find((d) => d.id === selectedDevice);

  if (!latest) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Device Info Header */}
        <Card className="border-border/50 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentDevice?.name}</h2>
                  <p className="text-sm text-muted-foreground">Device ID: {selectedDevice}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      currentDevice?.online ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {currentDevice?.online ? "Online" : "Offline"}
                  </span>
                </div>
                {latest && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(latest.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertBanner alerts={alerts} onClear={clearAlerts} />

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            title="Temperature"
            value={latest.temperature.toFixed(1)}
            unit="°C"
            icon={<Thermometer className="h-5 w-5" />}
            variant="default"
          />
          <SensorCard
            title="Humidity"
            value={latest.humidity.toFixed(1)}
            unit="%"
            icon={<Droplets className="h-5 w-5" />}
            variant="default"
          />
          <SensorCard
            title="Air Quality"
            value={Math.round(latest.aqi).toString()}
            unit="AQI"
            icon={<Wind className="h-5 w-5" />}
            variant={aqiLevel?.color ?? "default"}
            subtitle={aqiLevel?.label}
          />
          <AqiGauge aqi={latest.aqi} />
        </div>

        {/* Charts + Map */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Analytics</h2>
          <TimeFilter value={filterHours} onChange={setFilterHours} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <SensorChart
            data={readings}
            dataKey="humidity"
            title="Humidity vs Time"
            color="hsl(270, 70%, 60%)"
            unit="%"
          />
        </div>

        <EnhancedMap
          readings={readings}
          latest={latest}
          homeLocation={{
            lat: parseFloat(import.meta.env.VITE_HOME_LATITUDE) || 28.6139,
            lng: parseFloat(import.meta.env.VITE_HOME_LONGITUDE) || 77.209,
            name: import.meta.env.VITE_HOME_NAME || "Home Base"
          }}
        />
      </div>
    </div>
  );
};

export default Index;
