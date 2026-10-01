import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import { FaEgg } from "react-icons/fa6";
import { RiShoppingBasketLine } from "react-icons/ri";
import "leaflet/dist/leaflet.css";

import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";

const PIN_STYLE = [
  "display:flex",
  "align-items:center",
  "justify-content:center",
  "width:32px",
  "height:32px",
  "border-radius:50%",
  "border:2px solid #fff",
  "box-shadow:0 1px 4px rgba(0,0,0,0.4)",
].join(";");

function pinIcon(markup: string, background: string) {
  return L.divIcon({
    html: `<span style="${PIN_STYLE};background:${background}">${markup}</span>`,
    className: "map-pin-marker",
    iconSize: [32, 32],
  });
}

const userLocationIcon = pinIcon(
  renderToStaticMarkup(
    <RiShoppingBasketLine title="Your location" size={18} color="#fff" />,
  ),
  "#2b6cb0",
);
const listingIcon = pinIcon(
  renderToStaticMarkup(<FaEgg title="Egg listing" size={16} color="#fff" />),
  "#dd6b20",
);

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
    <Box w="full" h="full">
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
