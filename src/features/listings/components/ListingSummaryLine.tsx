import { Text } from "@chakra-ui/react";

import type { ListingUnit } from "@/features/listings/types/listing";
import {
  formatPrice,
  unitLabelKey,
} from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

interface ListingSummaryLineProps {
  eggCount: number;
  unit: ListingUnit;
  priceCents: number;
  currency: string;
  /** Default " · " between count and price; card uses default; detail may pass null and split layout */
  separator?: string | null;
}

export default function ListingSummaryLine({
  eggCount,
  unit,
  priceCents,
  currency,
  separator = " · ",
}: ListingSummaryLineProps) {
  const countLabel = `${eggCount} ${t(unitLabelKey(unit))}`;
  const priceLabel = formatPrice(priceCents, currency);
  return <Text>{`${countLabel}${separator ?? ""}${priceLabel}`}</Text>;
}
