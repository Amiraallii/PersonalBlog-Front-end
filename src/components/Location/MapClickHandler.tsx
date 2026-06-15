import { useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";

interface MapClickHandlerProps {
  onClick: (coords: { lat: number; lng: number }) => void;
}

export default function MapClickHandler({ onClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}