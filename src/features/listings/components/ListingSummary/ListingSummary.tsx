import { Stack, Text } from "@chakra-ui/react";

import KeyValueRow from "@/components/ui/KeyValueRow";
import StatusBadge from "@/features/listings/components/StatusBadge";
import type { Listing } from "@/features/listings/types/listing";
import { formatPrice } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

export type ListingSummaryProps = {
  listing: Listing;
};

export default function ListingSummary({ listing }: ListingSummaryProps) {
  const amountLabel = `${listing.egg_count} ${t("listing.eggs.unit")}`;
  const priceLabel = formatPrice(listing.price_per_egg_cents, listing.currency);

  return (
    <Stack gap="2">
      <KeyValueRow label={t("listing.available.label")}>
        <Text fontSize="sm">{amountLabel}</Text>
      </KeyValueRow>
      <KeyValueRow label={t("listing.price.label")}>
        <Text fontSize="sm">{priceLabel}</Text>
      </KeyValueRow>
      <KeyValueRow label={t("listing.status.label")}>
        <StatusBadge status={listing.status} />
      </KeyValueRow>
    </Stack>
  );
}
