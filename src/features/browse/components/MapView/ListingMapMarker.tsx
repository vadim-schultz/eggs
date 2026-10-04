import { Marker } from "react-leaflet";
import type { DivIcon } from "leaflet";

import type { ListingNear } from "@/features/listings/types/listing";

interface ListingMapMarkerProps {
  listing: ListingNear;
  selected: boolean;
  icon: DivIcon;
  onSelect: (id: string) => void;
}

/** Listing pin; selection opens the detail dialog (handled by the owner). */
export default function ListingMapMarker({
  listing,
  selected,
  icon,
  onSelect,
}: ListingMapMarkerProps) {
  return (
    <Marker
      position={[listing.lat, listing.lng]}
      icon={icon}
      opacity={selected ? 1 : 0.7}
      eventHandlers={{ click: () => onSelect(listing.id) }}
    />
  );
}
