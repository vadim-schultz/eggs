import { useEffect, useRef } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import { Marker } from "react-leaflet";
import type { DivIcon } from "leaflet";

import type { ListingNear } from "@/features/listings/types/listing";

import ListingMarkerPopover from "./ListingMarkerPopover";

interface ListingMapMarkerProps {
  listing: ListingNear;
  selected: boolean;
  icon: DivIcon;
  onSelect: (id: string) => void;
}

/** Listing pin with popover opened when ``selected``. */
export default function ListingMapMarker({
  listing,
  selected,
  icon,
  onSelect,
}: ListingMapMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }
    if (selected) {
      marker.openPopup();
    } else {
      marker.closePopup();
    }
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      position={[listing.lat, listing.lng]}
      icon={icon}
      opacity={selected ? 1 : 0.7}
      eventHandlers={{ click: () => onSelect(listing.id) }}
    >
      <ListingMarkerPopover listing={listing} />
    </Marker>
  );
}
