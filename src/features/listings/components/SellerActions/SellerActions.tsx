import { Stack } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import type { Listing } from "@/features/listings/types/listing";

import ExpiryEditor from "./ExpiryEditor";
import MarkStatusActions from "./MarkStatusActions";

export interface SellerActionsProps {
  listing: Listing;
  onChange: () => void;
}

/** Owner-only seller controls for status and expiry. */

export default function SellerActions({
  listing,
  onChange,
}: SellerActionsProps) {
  const { session } = useSession();
  const isOwner = session?.user.id === listing.seller_id;

  if (!isOwner) return null;

  return (
    <Stack gap="3" borderWidth="1px" borderRadius="md" p="3">
      <MarkStatusActions listing={listing} onChange={onChange} />
      <ExpiryEditor listing={listing} onChange={onChange} />
    </Stack>
  );
}
