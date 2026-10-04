import { Grid, RadioGroup } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import { CARTON_SIZES, type CartonSize } from "../../utils/carton";
import CartonOption from "./CartonOption";

export interface CartonPickerProps {
  remaining: number;
  pricePerEggCents: number;
  currency: string;
  value: CartonSize | null;
  onChange: (size: CartonSize) => void;
}

/** 4-column grid: radio, 6-carton, radio, 10-carton. */
export default function CartonPicker({
  remaining,
  pricePerEggCents,
  currency,
  value,
  onChange,
}: CartonPickerProps) {
  return (
    <RadioGroup.Root
      aria-label={t("carton.legend")}
      onValueChange={({ value: next }) => {
        const size = CARTON_SIZES.find((s) => String(s) === next);
        if (size !== undefined) onChange(size);
      }}
      value={value === null ? null : String(value)}
    >
      <Grid alignItems="center" gap="3" templateColumns="auto 1fr auto 1fr">
        {CARTON_SIZES.map((size) => (
          <CartonOption
            key={size}
            currency={currency}
            pricePerEggCents={pricePerEggCents}
            remaining={remaining}
            size={size}
          />
        ))}
      </Grid>
    </RadioGroup.Root>
  );
}
