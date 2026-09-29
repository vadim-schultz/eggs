import { Badge, Card, Text } from "@chakra-ui/react";

import { t } from "../i18n/t";
import {
  formatPrice,
  statusLabelKey,
  unitLabelKey,
  type Listing,
} from "../lib/listing";

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
          <Badge>{t(statusLabelKey(listing.status))}</Badge>
        </Card.Body>
      </button>
    </Card.Root>
  );
}
