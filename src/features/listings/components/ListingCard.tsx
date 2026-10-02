import { Card } from "@chakra-ui/react";

import type { Listing } from "@/features/listings/types/listing";

import ListingCardSummary from "./ListingCardSummary";

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
      w="fit-content"
      cursor="pointer"
      size="sm"
    >
      <button type="button" onClick={() => onSelect(listing.id)}>
        <Card.Body gap="2" textAlign="left">
          <ListingCardSummary listing={listing} />
        </Card.Body>
      </button>
    </Card.Root>
  );
}
