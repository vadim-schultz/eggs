import { Card, Text } from "@chakra-ui/react";

import StatusBadge from "./StatusBadge";
import { t } from "../i18n/t";
import { formatPrice, unitLabelKey, type Listing } from "../lib/listing";

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
          <Text>
            {listing.egg_count} {t(unitLabelKey(listing.unit))} ·{" "}
            {formatPrice(listing.price_cents, listing.currency)}
          </Text>
          <StatusBadge status={listing.status} />
        </Card.Body>
      </button>
    </Card.Root>
  );
}
