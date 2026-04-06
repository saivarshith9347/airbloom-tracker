import { useEffect, useRef } from "react";
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

interface LiveMapProps {
  readings: SensorReading[];
  latest: SensorReading | null;
}

export function LiveMap({ readings, latest }: LiveMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const prevPosRef = useRef<[number, number] | null>(null);
  const position: [number, number] = latest ? [latest.latitude, latest.longitude] : [0, 0];
  const path: [number, number][] = readings
    .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
    .map((r) => [r.latitude, r.longitude]);

  useEffect(() => {
    if (!latest || !mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: position,
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com">CARTO</a>',
    }).addTo(map);

    markerRef.current = L.marker(position).addTo(map);
    polylineRef.current = L.polyline(path, {
      color: "hsl(160 84% 39%)",
      weight: 3,
      opacity: 0.7,
    }).addTo(map);

    mapRef.current = map;
    prevPosRef.current = position;

    return () => {
      polylineRef.current?.remove();
      markerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
      prevPosRef.current = null;
    };
  }, [latest, path, position]);

  useEffect(() => {
    if (!latest || !mapRef.current || !markerRef.current || !polylineRef.current) return;

    markerRef.current.setLatLng(position);
    polylineRef.current.setLatLngs(path);

    if (
      !prevPosRef.current ||
      prevPosRef.current[0] !== position[0] ||
      prevPosRef.current[1] !== position[1]
    ) {
      mapRef.current.panTo(position, { animate: true, duration: 0.5 });
      prevPosRef.current = position;
    }
  }, [path, position]);

  if (!latest) return null;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-slide-in">
      <div className="p-4 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Live GPS Tracking</h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
          {latest.latitude.toFixed(5)}, {latest.longitude.toFixed(5)}
        </p>
      </div>
      <div ref={mapElementRef} className="h-[320px] w-full" />
    </div>
  );
}
