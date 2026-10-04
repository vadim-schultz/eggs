import { Grid } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import { CARTON_SIZES, type CartonSize } from "../../utils/carton";
import CartonCard from "./CartonCard";

export interface CartonPickerProps {
  remaining: number;
  pricePerEggCents: number;
  currency: string;
  value: CartonSize | null;
  onChange: (size: CartonSize) => void;
}

/** 2×1 grid of selectable carton cards (6 and 10). */
export default function CartonPicker({
  remaining,
  pricePerEggCents,
  currency,
  value,
  onChange,
}: CartonPickerProps) {
  return (
    <Grid
      aria-label={t("carton.legend")}
      gap="3"
      role="radiogroup"
      templateColumns="1fr 1fr"
    >
      {CARTON_SIZES.map((size) => (
        <CartonCard
          key={size}
          currency={currency}
          onSelect={onChange}
          pricePerEggCents={pricePerEggCents}
          remaining={remaining}
          selected={value === size}
          size={size}
        />
      ))}
    </Grid>
  );
}
