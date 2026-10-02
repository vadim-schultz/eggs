import { Card, Text } from "@chakra-ui/react";

import BrailleQuantityRow from "@/components/ui/BrailleQuantityRow";
import KeyValueRow from "@/components/ui/KeyValueRow";
import type { Listing } from "@/features/listings/types/listing";
import {
  formatPrice,
  unitLabelKey,
} from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

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
  const amountLabel = `${listing.egg_count} ${t(unitLabelKey(listing.unit))}`;
  const priceLabel = formatPrice(listing.price_cents, listing.currency);

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
          <BrailleQuantityRow
            eggCount={listing.egg_count}
            unit={listing.unit}
          />
          <KeyValueRow label={t("listing.count.label")}>
            <Text fontSize="sm">{amountLabel}</Text>
          </KeyValueRow>
          <KeyValueRow label={t("listing.price.label")}>
            <Text fontSize="sm">{priceLabel}</Text>
          </KeyValueRow>
          <KeyValueRow label={t("listing.status.label")}>
            <StatusBadge status={listing.status} />
          </KeyValueRow>
        </Card.Body>
      </button>
    </Card.Root>
  );
}
