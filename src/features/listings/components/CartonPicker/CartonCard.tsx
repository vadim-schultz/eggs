import { chakra, Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import {
  cartonPriceCents,
  isCartonAvailable,
  type CartonSize,
} from "../../utils/carton";
import { formatPrice } from "../../utils/formatListing";
import CartonEggs from "./CartonEggs";

export interface CartonCardProps {
  size: CartonSize;
  remaining: number;
  pricePerEggCents: number;
  currency: string;
  selected: boolean;
  onSelect: (size: CartonSize) => void;
}

/** One selectable, rounded card; the whole card highlights when selected. */
export default function CartonCard({
  size,
  remaining,
  pricePerEggCents,
  currency,
  selected,
  onSelect,
}: CartonCardProps) {
  const available = isCartonAvailable(remaining, size);
  const unavailable = t("carton.unavailable");

  return (
    <chakra.button
      aria-checked={selected}
      aria-label={t("carton.option").replace("{n}", String(size))}
      bg={selected ? "colorPalette.solid" : "bg"}
      borderColor={selected ? "colorPalette.solid" : "border"}
      borderWidth="2px"
      colorPalette="green"
      color={selected ? "colorPalette.contrast" : "fg"}
      cursor={available ? "pointer" : "not-allowed"}
      disabled={!available}
      onClick={() => onSelect(size)}
      opacity={available ? 1 : 0.5}
      p="3"
      role="radio"
      rounded="xl"
      title={available ? undefined : unavailable}
      type="button"
    >
      <CartonEggs size={size} />
      <Text fontSize="sm" fontWeight="medium">
        {formatPrice(cartonPriceCents(pricePerEggCents, size), currency)}
      </Text>
      {!available && <Text srOnly>{unavailable}</Text>}
    </chakra.button>
  );
}
