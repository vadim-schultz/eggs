import { Stack } from "@chakra-ui/react";

import ContactReveal from "@/features/listings/components/ContactReveal";
import ReserveButton from "@/features/listings/components/ReserveButton";
import type { Listing } from "@/features/listings/types/listing";

export type BuyerListingDialogProps = {
  listing: Listing;
  onChange: () => void;
};

export default function BuyerListingDialog({
  listing,
  onChange,
}: BuyerListingDialogProps) {
  return (
    <Stack gap="2">
      <ReserveButton listing={listing} onChange={onChange} />
      {/* key={listing.status}: a successful reserve/cancel changes who RLS
          reveals the contact note to, but listing.id never changes — remount
          on status change to re-run the query instead of caching a stale
          "not visible yet" result. */}
      <ContactReveal key={listing.status} listingId={listing.id} />
    </Stack>
  );
}
