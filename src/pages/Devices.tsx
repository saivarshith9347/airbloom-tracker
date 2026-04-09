import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, MapPin, Trash2, Plus, ChevronRight } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";
import { DeviceConfig } from "@/types/device";

export default function Devices() {
  const navigate = useNavigate();
  const { devices, addDevice, removeDevice } = useDevices();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    channelId: "",
    apiKey: "",
    location: "",
  });

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
              <p className="text-muted-foreground">Manage your ThingSpeak devices</p>
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{devices.length > 0 ? 1 : 0}</p>
              </div>
              <Layers className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Configured</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Layers className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your Devices</h2>
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
            {devices.map((device, index) => (
              <Card
                key={device.id}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                  index === 0 ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        {index === 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
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
                  {index === 0 && (
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
    </div>
  );
}
