import { Stack } from "@chakra-ui/react";
import { useState } from "react";

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
  // A reserve/cancel changes who RLS reveals the contact note to, but neither
  // listing.id nor (after a partial reserve) listing.status changes. Bump a
  // counter on every change so ContactReveal remounts and refetches.
  const [changes, setChanges] = useState(0);
  const handleChange = () => {
    setChanges((n) => n + 1);
    onChange();
  };

  return (
    <Stack gap="2">
      <ReserveButton listing={listing} onChange={handleChange} />
      <ContactReveal
        key={`${listing.status}-${changes}`}
        listingId={listing.id}
      />
    </Stack>
  );
}
