import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";

import type { GeoPoint } from "../hooks/useGeolocation";
import type { ListingNear } from "../lib/listing";

function emojiIcon(emoji: string) {
  return L.divIcon({
    html: emoji,
    className: "emoji-marker",
    iconSize: [28, 28],
  });
}

const userLocationIcon = emojiIcon("🧺");
const listingIcon = emojiIcon("🥚");

interface MapViewProps {
  center: GeoPoint;
  listings: ListingNear[];
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
    <Box
      h="400px"
      w="full"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <Recenter center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[center.lat, center.lng]} icon={userLocationIcon} />
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={listingIcon}
            opacity={listing.id === selectedId ? 1 : 0.7}
            eventHandlers={{ click: () => onSelect(listing.id) }}
          />
        ))}
      </MapContainer>
    </Box>
  );
}
