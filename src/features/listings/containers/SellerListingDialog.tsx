import { Stack } from "@chakra-ui/react";

import ContactReveal from "@/features/listings/components/ContactReveal";
import ListingSummary from "@/features/listings/components/ListingSummary";
import type { Listing } from "@/features/listings/types/listing";

export type SellerListingDialogProps = {
  listing: Listing;
};

export default function SellerListingDialog({
  listing,
}: SellerListingDialogProps) {
  return (
    <Stack gap="2">
      <ListingSummary listing={listing} />
      <ContactReveal listingId={listing.id} />
    </Stack>
  );
}
