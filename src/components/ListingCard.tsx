import { Badge, Box, Text } from "@chakra-ui/react";

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
    <Box
      as="button"
      onClick={() => onSelect(listing.id)}
      borderWidth="1px"
      borderColor={selected ? "border.emphasized" : "border"}
      borderRadius="md"
      p="3"
      textAlign="left"
      w="full"
    >
      <Text fontWeight="bold">{listing.location_label}</Text>
      <Text>
        {listing.egg_count} {t(unitLabelKey(listing.unit))} ·{" "}
        {formatPrice(listing.price_cents, listing.currency)}
      </Text>
      <Badge>{t(statusLabelKey(listing.status))}</Badge>
    </Box>
  );
}
