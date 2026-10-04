import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";

import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";

import { listingIcon, userLocationIcon } from "./icons";
import ListingMapMarker from "./ListingMapMarker";
import Recenter from "./Recenter";

interface MapViewProps {
  center: GeoPoint;
  listings: ListingNear[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  fitGermany?: boolean;
  showUserMarker?: boolean;
  radiusM?: number;
  onUserMarkerClick?: () => void;
}

export default function MapView({
  center,
  listings,
  selectedId,
  onSelect,
  fitGermany = false,
  showUserMarker = true,
  radiusM = 5000,
  onUserMarkerClick,
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
          <Marker
            position={[center.lat, center.lng]}
            icon={userLocationIcon}
            eventHandlers={{ click: () => onUserMarkerClick?.() }}
          />
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
