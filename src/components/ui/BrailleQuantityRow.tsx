import { Text } from "@chakra-ui/react";

import type { ListingUnit } from "@/features/listings/types/listing";
import {
  renderEggQuantityBraille,
  totalEggsFromListing,
} from "@/lib/braille/eggQuantity";

export interface BrailleQuantityRowProps {
  eggCount: number;
  unit: ListingUnit;
}

/** Monospace one-line braille preview for a listing egg amount. */
export default function BrailleQuantityRow({
  eggCount,
  unit,
}: BrailleQuantityRowProps) {
  const braille = renderEggQuantityBraille(
    totalEggsFromListing(eggCount, unit),
  );

  return (
    <Text
      data-testid="braille-quantity-row"
      fontFamily="mono"
      fontSize="xs"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      minH="1.25rem"
    >
      {braille}
    </Text>
  );
}
