import { Popup } from "react-leaflet";

import ListingCard from "@/features/listings/components/ListingCard";
import type { ListingNear } from "@/features/listings/types/listing";

interface ListingMarkerPopoverProps {
  listing: ListingNear;
}

/** Leaflet popup hosting a compact listing card; viewport-safe via ``autoPan``. */
export default function ListingMarkerPopover({
  listing,
}: ListingMarkerPopoverProps) {
  return (
    <Popup autoPan autoPanPadding={[24, 24]}>
      <div data-testid="listing-marker-popover">
        <ListingCard listing={listing} selected onSelect={() => {}} />
      </div>
    </Popup>
  );
}
