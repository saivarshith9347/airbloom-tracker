import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, MapPin, Activity, Clock, ChevronRight } from "lucide-react";
import { DeviceInfo } from "@/lib/thingspeak";

// Extended mock devices with more details
const DEVICES: (DeviceInfo & { location: string; lastAqi: number; status: string })[] = [
  {
    id: "esp32-001",
    name: "ESP32 Unit Alpha",
    online: true,
    lastUpdated: new Date().toISOString(),
    location: "New Delhi, India",
    lastAqi: 85,
    status: "Active",
  },
  {
    id: "esp32-002",
    name: "ESP32 Unit Beta",
    online: false,
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    location: "Mumbai, India",
    lastAqi: 120,
    status: "Offline",
  },
  {
    id: "esp32-003",
    name: "ESP32 Unit Gamma",
    online: true,
    lastUpdated: new Date(Date.now() - 300000).toISOString(),
    location: "Bangalore, India",
    lastAqi: 65,
    status: "Active",
  },
];

export default function Devices() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDevice(deviceId);
    // Navigate to dashboard with device ID
    navigate(`/?device=${deviceId}`);
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "success";
    if (aqi <= 100) return "warning";
    return "danger";
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
            <p className="text-muted-foreground">Manage and monitor your IoT devices</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{DEVICES.length}</p>
              </div>
              <Layers className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-success">
                  {DEVICES.filter((d) => d.online).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {DEVICES.filter((d) => !d.online).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Available Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEVICES.map((device) => (
            <Card
              key={device.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedDevice === device.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleDeviceClick(device.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {device.location}
                    </CardDescription>
                  </div>
                  <Badge variant={device.online ? "default" : "secondary"} className="gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        device.online ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
                      }`}
                    />
                    {device.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Device ID</span>
                  <span className="font-mono text-xs">{device.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last AQI</span>
                  <Badge variant={getAqiColor(device.lastAqi) as any}>
                    {device.lastAqi}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Updated
                  </span>
                  <span className="text-xs">
                    {new Date(device.lastUpdated).toLocaleString()}
                  </span>
                </div>
                <Button className="w-full mt-2 gap-2" variant="outline">
                  View Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
