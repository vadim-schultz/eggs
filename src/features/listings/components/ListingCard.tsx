import { Card, SimpleGrid, Text } from "@chakra-ui/react";

import BrailleQuantityRow from "@/components/ui/BrailleQuantityRow";
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
      w="full"
      cursor="pointer"
      size="sm"
    >
      <button type="button" onClick={() => onSelect(listing.id)}>
        <Card.Body gap="2" textAlign="left">
          <BrailleQuantityRow
            eggCount={listing.egg_count}
            unit={listing.unit}
          />
          <SimpleGrid columns={2} gapX="2" gapY="1" fontSize="sm">
            <Text color="fg.muted">{t("listing.count.label")}</Text>
            <Text>{amountLabel}</Text>
            <Text color="fg.muted">{t("listing.price.label")}</Text>
            <Text>{priceLabel}</Text>
          </SimpleGrid>
          <StatusBadge status={listing.status} />
        </Card.Body>
      </button>
    </Card.Root>
  );
}
