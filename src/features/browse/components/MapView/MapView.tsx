import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import { TbBasket, TbEgg } from "react-icons/tb";
import "leaflet/dist/leaflet.css";

import { easterColors } from "@/theme/tokens/colors";
import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";

import ListingMapMarker from "./ListingMapMarker";
import Recenter from "./Recenter";

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
    <TbBasket title="Your location" size={18} color="#fff" />,
  ),
  easterColors.cornflower[500].value,
);
const listingIcon = pinIcon(
  renderToStaticMarkup(<TbEgg title="Egg listing" size={16} color="#fff" />),
  easterColors.coral[500].value,
);

interface MapViewProps {
  center: GeoPoint;
  listings: ListingNear[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  fitGermany?: boolean;
  showUserMarker?: boolean;
  radiusM?: number;
}

export default function MapView({
  center,
  listings,
  selectedId,
  onSelect,
  fitGermany = false,
  showUserMarker = true,
  radiusM = 5000,
}: MapViewProps) {
  return (
    <Box w="full" h="full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={fitGermany ? 6 : 12}
        style={{ height: "100%", width: "100%" }}
      >
        <Recenter center={center} fitGermany={fitGermany} radiusM={radiusM} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {showUserMarker ? (
          <Marker position={[center.lat, center.lng]} icon={userLocationIcon} />
        ) : null}
        {listings.map((listing) => (
          <ListingMapMarker
            key={listing.id}
            listing={listing}
            selected={listing.id === selectedId}
            icon={listingIcon}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>
    </Box>
  );
}
