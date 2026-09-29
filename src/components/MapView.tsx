import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import type { GeoPoint } from "../hooks/useGeolocation";
import type { Listing } from "../lib/listing";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  center: GeoPoint;
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function Recenter({ center }: { center: GeoPoint }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map]);

  return null;
}

export default function MapView({
  center,
  listings,
  selectedId,
  onSelect,
}: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <Recenter center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {listings.map((listing) => {
        const [lng, lat] = listing.location.coordinates;
        return (
          <Marker
            key={listing.id}
            position={[lat, lng]}
            opacity={listing.id === selectedId ? 1 : 0.7}
            eventHandlers={{ click: () => onSelect(listing.id) }}
          />
        );
      })}
    </MapContainer>
  );
}
