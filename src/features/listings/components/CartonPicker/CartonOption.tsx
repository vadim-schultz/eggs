import { chakra, RadioGroup, Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import {
  cartonPriceCents,
  isCartonAvailable,
  type CartonSize,
} from "../../utils/carton";
import { formatPrice } from "../../utils/formatListing";
import CartonEggs from "./CartonEggs";

export interface CartonOptionProps {
  size: CartonSize;
  remaining: number;
  pricePerEggCents: number;
  currency: string;
}

/** Two grid cells: the radio, then a label wrapping the eggs and price. */
export default function CartonOption({
  size,
  remaining,
  pricePerEggCents,
  currency,
}: CartonOptionProps) {
  const available = isCartonAvailable(remaining, size);
  const inputId = `carton-option-${size}`;
  const unavailable = t("carton.unavailable");

  return (
    <>
      <RadioGroup.Item disabled={!available} value={String(size)}>
        <RadioGroup.ItemHiddenInput
          aria-label={t("carton.option").replace("{n}", String(size))}
          id={inputId}
        />
        <RadioGroup.ItemControl />
      </RadioGroup.Item>
      <chakra.label
        cursor={available ? "pointer" : "not-allowed"}
        htmlFor={inputId}
        opacity={available ? 1 : 0.5}
        title={available ? undefined : unavailable}
      >
        <CartonEggs size={size} />
        <Text color="fg.muted" fontSize="xs">
          {formatPrice(cartonPriceCents(pricePerEggCents, size), currency)}
        </Text>
        {!available && <Text srOnly>{unavailable}</Text>}
      </chakra.label>
    </>
  );
}
