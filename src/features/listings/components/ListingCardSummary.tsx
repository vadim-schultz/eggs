import { Text } from "@chakra-ui/react";

import EggQuantityRow from "@/components/ui/EggQuantityRow";
import KeyValueRow from "@/components/ui/KeyValueRow";
import type { Listing } from "@/features/listings/types/listing";
import { displayEggCount } from "@/features/listings/utils/displayEggCount";
import {
  formatPrice,
  unitLabelKey,
} from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

interface ListingCardSummaryProps {
  listing: Listing;
}

/** Shared listing heading, available count, and price for browse cards and map popovers. */
export default function ListingCardSummary({
  listing,
}: ListingCardSummaryProps) {
  const amountLabel = `${listing.egg_count} ${t(unitLabelKey(listing.unit))}`;
  const priceLabel = formatPrice(listing.price_per_egg_cents, listing.currency);

  return (
    <>
      <EggQuantityRow
        count={displayEggCount(listing.egg_count, listing.unit)}
      />
      <KeyValueRow label={t("listing.count.label")}>
        <Text fontSize="sm">{amountLabel}</Text>
      </KeyValueRow>
      <KeyValueRow label={t("listing.price.label")}>
        <Text fontSize="sm">{priceLabel}</Text>
      </KeyValueRow>
    </>
  );
}
