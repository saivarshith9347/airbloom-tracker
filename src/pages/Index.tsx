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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const {
    readings, latest, activeDevice, activeDevices,
    filterHours, setFilterHours, alerts, clearAlerts, isLoading,
  } = useAirMonitor();

  const aqiLevel = latest ? getAqiLevel(latest.aqi) : null;

  // No active devices configured
  if (activeDevices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Wind className="h-16 w-16 mx-auto text-muted-foreground opacity-40" />
          <h2 className="text-xl font-semibold">No active devices</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Activate at least one ThingSpeak device in the Devices page to start monitoring air quality data.
          </p>
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={() => navigate("/devices")} className="mt-4">
              Go to Devices
            </Button>
            {activeDevice === null && (
              <p className="text-xs text-muted-foreground">
                {activeDevices.length === 0 ? 'No devices configured yet' : 'Devices exist but none are active'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
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

  // No sensor data received
  if (!latest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Wind className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
          <h2 className="text-lg font-semibold">No sensor data</h2>
          <p className="text-sm text-muted-foreground">No data received from ThingSpeak. Check your API configuration.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Device: {activeDevice?.name} (Channel: {activeDevice?.channelId})
          </p>
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
                  <h2 className="text-xl font-bold">{activeDevice?.name || 'Device'}</h2>
                  <p className="text-sm text-muted-foreground">
                    Channel: {activeDevice?.channelId}
                    {activeDevices.length > 1 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        +{activeDevices.length - 1} more active
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-sm font-medium">Online</span>
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
          homeLocation={(() => {
            const lat = parseFloat(import.meta.env.VITE_HOME_LATITUDE ?? '');
            const lng = parseFloat(import.meta.env.VITE_HOME_LONGITUDE ?? '');
            return {
              lat: isNaN(lat) ? 28.6139 : lat,
              lng: isNaN(lng) ? 77.209 : lng,
              name: import.meta.env.VITE_HOME_NAME || "Home Base",
            };
          })()}
        />
      </div>
    </div>
  );
};

export default Index;
