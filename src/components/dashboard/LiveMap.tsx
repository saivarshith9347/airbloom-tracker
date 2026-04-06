import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SensorReading } from "@/lib/thingspeak";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  const prevPos = useRef(position);
  useEffect(() => {
    if (prevPos.current[0] !== position[0] || prevPos.current[1] !== position[1]) {
      map.panTo(position, { animate: true, duration: 0.5 });
      prevPos.current = position;
    }
  }, [position, map]);
  return null;
}

interface LiveMapProps {
  readings: SensorReading[];
  latest: SensorReading | null;
}

export function LiveMap({ readings, latest }: LiveMapProps) {
  if (!latest) return null;

  const position: [number, number] = [latest.latitude, latest.longitude];
  const path: [number, number][] = readings
    .filter((r) => r.latitude && r.longitude)
    .map((r) => [r.latitude, r.longitude]);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-slide-in">
      <div className="p-4 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Live GPS Tracking</h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {latest.latitude.toFixed(5)}, {latest.longitude.toFixed(5)}
        </p>
      </div>
      <div className="h-[320px]">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater position={position} />
          {path.length > 1 && (
            <Polyline
              positions={path}
              pathOptions={{ color: "hsl(160, 84%, 39%)", weight: 3, opacity: 0.7 }}
            />
          )}
          <Marker position={position} />
        </MapContainer>
      </div>
    </div>
  );
}
