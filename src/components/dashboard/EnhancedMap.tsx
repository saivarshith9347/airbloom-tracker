import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SensorReading } from "@/lib/thingspeak";
import { Button } from "@/components/ui/button";
import { Map, Satellite, Navigation, Home, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface EnhancedMapProps {
  readings: SensorReading[];
  latest: SensorReading | null;
  homeLocation?: { lat: number; lng: number; name: string };
}

type MapStyle = "standard" | "satellite" | "dark";

// Map tile configurations
const tileConfigs: Record<MapStyle, { url: string; attribution: string }> = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com">CARTO</a>',
  },
};

export function EnhancedMap({ readings, latest, homeLocation }: EnhancedMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const homeMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const prevPosRef = useRef<[number, number] | null>(null);
  
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");
  const [showRoute, setShowRoute] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const position: [number, number] = latest ? [latest.latitude, latest.longitude] : [0, 0];
  const path: [number, number][] = readings
    .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
    .map((r) => [r.latitude, r.longitude]);

  const home: [number, number] = homeLocation
    ? [homeLocation.lat, homeLocation.lng]
    : [28.6139, 77.209]; // Default home

  // Initialize map
  useEffect(() => {
    if (!latest || !mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: position,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    const config = tileConfigs[mapStyle];
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
    }).addTo(map);

    // Current position marker
    markerRef.current = L.marker(position, {
      title: "Current Location",
    })
      .addTo(map)
      .bindPopup(`<b>Current Position</b><br/>AQI: ${latest.aqi.toFixed(0)}`);

    // Home marker
    const homeIcon = L.divIcon({
      html: '<div style="background: hsl(160 84% 39%); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    homeMarkerRef.current = L.marker(home, { icon: homeIcon, title: "Home Location" })
      .addTo(map)
      .bindPopup(`<b>${homeLocation?.name || "Home Location"}</b>`);

    // Path polyline
    polylineRef.current = L.polyline(path, {
      color: "hsl(160 84% 39%)",
      weight: 3,
      opacity: 0.7,
    }).addTo(map);

    mapRef.current = map;
    prevPosRef.current = position;

    return () => {
      routeLineRef.current?.remove();
      polylineRef.current?.remove();
      homeMarkerRef.current?.remove();
      markerRef.current?.remove();
      tileLayerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      homeMarkerRef.current = null;
      polylineRef.current = null;
      routeLineRef.current = null;
      tileLayerRef.current = null;
      prevPosRef.current = null;
    };
  }, [latest]);

  // Update map style
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();
    const config = tileConfigs[mapStyle];
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, [mapStyle]);

  // Update markers and path
  useEffect(() => {
    if (!latest || !mapRef.current || !markerRef.current || !polylineRef.current) return;

    markerRef.current.setLatLng(position);
    markerRef.current.setPopupContent(`<b>Current Position</b><br/>AQI: ${latest.aqi.toFixed(0)}`);
    polylineRef.current.setLatLngs(path);

    if (
      !prevPosRef.current ||
      prevPosRef.current[0] !== position[0] ||
      prevPosRef.current[1] !== position[1]
    ) {
      mapRef.current.panTo(position, { animate: true, duration: 0.5 });
      prevPosRef.current = position;
    }
  }, [path, position, latest]);

  // Toggle route to home
  const toggleRoute = () => {
    if (!mapRef.current || !latest) return;

    if (showRoute && routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
      setShowRoute(false);
    } else {
      routeLineRef.current = L.polyline([position, home], {
        color: "hsl(38 92% 50%)",
        weight: 3,
        opacity: 0.8,
        dashArray: "10, 10",
      }).addTo(mapRef.current);
      setShowRoute(true);

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([position, home]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!latest) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card overflow-hidden animate-slide-in transition-all",
        isFullscreen && "fixed inset-4 z-50 shadow-2xl"
      )}
    >
      <div className="p-4 pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Live GPS Tracking</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {latest.latitude.toFixed(5)}, {latest.longitude.toFixed(5)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {/* Map Style Toggle */}
          <Button
            variant={mapStyle === "dark" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMapStyle("dark")}
            className="h-8 px-2"
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant={mapStyle === "standard" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMapStyle("standard")}
            className="h-8 px-2"
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant={mapStyle === "satellite" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMapStyle("satellite")}
            className="h-8 px-2"
          >
            <Satellite className="h-4 w-4" />
          </Button>
          
          {/* Navigation Toggle */}
          <Button
            variant={showRoute ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleRoute}
            className="h-8 px-2"
          >
            <Navigation className="h-4 w-4" />
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 px-2"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={mapElementRef} className={cn("w-full", isFullscreen ? "h-[calc(100%-4rem)]" : "h-[320px]")} />
    </div>
  );
}
