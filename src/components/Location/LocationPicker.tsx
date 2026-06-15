import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, Marker, TileLayer, useMap, MapContainer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import MapClickHandler from "./MapClickHandler";
import { parseLocation, formatLocation } from "./locUtils";
import "./LocationPicker.css";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

interface FlyToCenterProps {
  center: [number, number] | null;
}

function FlyToCenter({ center }: FlyToCenterProps) {
  const map = useMap();
  const prevCenter = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!center) return;

    if (
      prevCenter.current?.lat === center[0] &&
      prevCenter.current?.lng === center[1]
    )
      return;

    map.flyTo(center, map.getZoom());
    prevCenter.current = { lat: center[0], lng: center[1] };
  }, [center, map]);

  return null;
}

interface LocationPickerProps {
  value: string | null | undefined;
  onChange?: (val: string) => void;
  defaultCenter?: [number, number];
  showRadius?: boolean;
  defaultZoom?: number;
  readOnly?: boolean;
}

export default function LocationPicker({
  value,
  onChange,
  defaultCenter = [35.6892, 51.389],
  showRadius = true,
  defaultZoom = 15,
  readOnly = false,
}: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(1);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState<boolean>(false);

  useEffect(() => {
    const parsed = parseLocation(value);
    if (parsed) {
      setPosition({ lat: parsed.lat, lng: parsed.lng });
      setRadius(parsed.radius ?? 0);
    }
  }, [value]);

  useEffect(() => {
    if (!position) return;
    onChange?.(formatLocation({ ...position, radius }));
  }, [position, radius]);

  function handleMapClick({ lat, lng }: { lat: number; lng: number }) {
    if (readOnly) return;
    setPosition({ lat, lng });
    setGeoStatus("");
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoStatus("مرورگر شما از GPS پشتیبانی نمی‌کند");
      return;
    }

    setGeoLoading(true);
    setGeoStatus("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setPosition({ lat, lng });
        setFlyTarget([lat, lng]);
        setGeoLoading(false);
        setGeoStatus("");
      },
      (err) => {
        setGeoLoading(false);
        const messages: Record<number, string> = {
          1: "دسترسی به موقعیت رد شد",
          2: "موقعیت در دسترس نیست",
          3: "زمان درخواست تمام شد",
        };
        setGeoStatus(messages[err.code] ?? "خطا در دریافت موقعیت");
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }

  return (
    <div className="lp-wrapper disable-swipe">
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="lp-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {!readOnly && <MapClickHandler onClick={handleMapClick} />}
        {flyTarget && <FlyToCenter center={flyTarget} />}

        {position && (
          <>
            <Marker position={[position.lat, position.lng]} />
            {showRadius && radius > 0 && (
              <Circle
                center={[position.lat, position.lng]}
                radius={radius}
                pathOptions={{ color: "#3b82f6", fillOpacity: 0.1 }}
              />
            )}
          </>
        )}
      </MapContainer>

      {!readOnly && (
        <div className="lp-toolbar">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            onClick={handleGeolocate}
            disabled={geoLoading}
          >
            📍 {geoLoading ? "در حال دریافت..." : "موقعیت من"}
          </button>

          {showRadius && (
            <div className="lp-radius-group">
              <label className="text-sm text-[var(--muted)]">شعاع (متر):</label>
              <input
                type="number"
                min={0}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-sm"
                placeholder="0"
              />
            </div>
          )}
        </div>
      )}

      {position && !readOnly && (
        <div className="lp-coords">
          <span>عرض: {position.lat.toFixed(6)}</span>
          <span>طول: {position.lng.toFixed(6)}</span>
          {showRadius && radius > 0 && (
            <span>
              شعاع: {radius >= 1000 ? `${(radius / 1000).toFixed(1)} کیلومتر` : `${radius} متر`}
            </span>
          )}
        </div>
      )}
      {geoStatus && <div className="lp-status">{geoStatus}</div>}
    </div>
  );
}