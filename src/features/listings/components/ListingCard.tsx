import { Card, Text } from "@chakra-ui/react";

import type { Listing } from "@/features/listings/types/listing";

import ListingSummaryLine from "./ListingSummaryLine";
import StatusBadge from "./StatusBadge";

interface ListingCardProps {
  listing: Listing;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ListingCard({
  listing,
  selected,
  onSelect,
}: ListingCardProps) {
  return (
    <Card.Root
      asChild
      variant={selected ? "elevated" : "outline"}
      w="full"
      cursor="pointer"
    >
      <button type="button" onClick={() => onSelect(listing.id)}>
        <Card.Body gap="1" textAlign="left">
          <Text fontWeight="bold">{listing.location_label}</Text>
          <ListingSummaryLine
            eggCount={listing.egg_count}
            unit={listing.unit}
            priceCents={listing.price_cents}
            currency={listing.currency}
          />
          <StatusBadge status={listing.status} />
        </Card.Body>
      </button>
    </Card.Root>
  );
}
