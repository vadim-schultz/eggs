import { Card, Stack } from "@chakra-ui/react";

import ReserveButton from "@/features/listings/components/ReserveButton";
import ListingCardSummary from "@/features/listings/components/ListingCardSummary";
import type { ListingNear } from "@/features/listings/types/listing";

interface ListingPopoverContentProps {
  listing: ListingNear;
  onReserveChange: () => void;
}

/** Map popover body: listing summary plus reserve controls (not inside a card button). */
export default function ListingPopoverContent({
  listing,
  onReserveChange,
}: ListingPopoverContentProps) {
  return (
    <Card.Root variant="elevated" w="fit-content" size="sm">
      <Card.Body gap="3" textAlign="left">
        <Stack gap="2">
          <ListingCardSummary listing={listing} />
        </Stack>
        <ReserveButton listing={listing} onChange={onReserveChange} />
      </Card.Body>
    </Card.Root>
  );
}
