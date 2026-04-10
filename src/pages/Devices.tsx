import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layers, MapPin, Trash2, Plus, ChevronRight, Power, PowerOff } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { DeviceConfig } from "@/types/device";

export default function Devices() {
  const navigate = useNavigate();
  const { devices, addDevice, removeDevice, toggleDeviceActive } = useDevices();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    channelId: "",
    apiKey: "",
    location: "",
  });

  // Calculate active devices count
  const activeDevicesCount = devices.filter(d => d.isActive).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.channelId || !formData.apiKey) {
      alert("Please fill in all required fields");
      return;
    }

    const newDevice: DeviceConfig = {
      id: crypto.randomUUID(),
      name: formData.name,
      channelId: formData.channelId,
      apiKey: formData.apiKey,
      location: formData.location,
      isActive: false, // New devices start as inactive
      createdAt: new Date().toISOString(),
    };

    addDevice(newDevice);
    setFormData({ name: "", channelId: "", apiKey: "", location: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this device?")) {
      removeDevice(id);
    }
  };

  /**
   * Toggle device active state
   * Supports multiple active devices simultaneously
   */
  const handleToggleActive = (id: string, currentState: boolean) => {
    console.log(`[Devices] Toggling device ${id} from ${currentState} to ${!currentState}`);
    toggleDeviceActive(id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
              <p className="text-muted-foreground">Manage your ThingSpeak devices - Multiple devices can be active</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Add Device Form */}
      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Add New Device</CardTitle>
            <CardDescription>Connect a ThingSpeak channel to monitor air quality data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Home Sensor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New Delhi, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="channelId">ThingSpeak Channel ID *</Label>
                  <Input
                    id="channelId"
                    placeholder="e.g., 2739166"
                    value={formData.channelId}
                    onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Read API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your ThingSpeak Read API Key"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Device</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Layers className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold text-success">{activeDevicesCount}</p>
              </div>
              <Power className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive Devices</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {devices.length - activeDevicesCount}
                </p>
              </div>
              <PowerOff className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Devices</h2>
          {activeDevicesCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {activeDevicesCount} {activeDevicesCount === 1 ? 'device' : 'devices'} currently active
            </p>
          )}
        </div>
        
        {devices.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No devices configured</p>
              <p className="text-sm mt-1">Click "Add Device" to connect your first ThingSpeak channel.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <Card
                key={device.id}
                className={`transition-all hover:shadow-lg ${
                  device.isActive ? "ring-2 ring-success" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        {device.isActive && (
                          <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                            <Power className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                      {device.location && (
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          {device.location}
                        </CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(device.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Channel ID</span>
                    <span className="font-mono text-xs">{device.channelId}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">API Key</span>
                    <span className="font-mono text-xs">••••••••</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Added</span>
                    <span className="text-xs">
                      {new Date(device.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Toggle Active/Inactive */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {device.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Switch
                      checked={device.isActive}
                      onCheckedChange={() => handleToggleActive(device.id, device.isActive)}
                    />
                  </div>

                  {device.isActive && (
                    <Button
                      className="w-full mt-2 gap-2"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      View Dashboard
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      {devices.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Multi-Device Support</p>
                <p className="text-xs text-muted-foreground">
                  You can activate multiple devices simultaneously. Toggle the switch to activate or deactivate any device independently.
                  Active devices will stream data to the dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
