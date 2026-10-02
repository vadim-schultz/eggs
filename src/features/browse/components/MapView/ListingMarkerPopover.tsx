import { Popup } from "react-leaflet";

import type { ListingNear } from "@/features/listings/types/listing";

import ListingPopoverContent from "./ListingPopoverContent";

interface ListingMarkerPopoverProps {
  listing: ListingNear;
  onReserveChange?: () => void;
}

/** Leaflet popup hosting listing summary and reserve; viewport-safe via ``autoPan``. */
export default function ListingMarkerPopover({
  listing,
  onReserveChange = () => {},
}: ListingMarkerPopoverProps) {
  return (
    <Popup autoPan autoPanPadding={[24, 24]}>
      <div data-testid="listing-marker-popover">
        <ListingPopoverContent
          listing={listing}
          onReserveChange={onReserveChange}
        />
      </div>
    </Popup>
  );
}
