import { Stack } from "@chakra-ui/react";

import BrailleQuantityRow from "@/components/ui/BrailleQuantityRow";
import SliderWithValue from "@/components/ui/SliderWithValue";

import type { ListingUnit } from "@/features/listings/types/listing";

export interface ReserveAmountControlProps {
  unit: ListingUnit;
  maxEggCount: number;
  eggCount: number;
  onEggCountChange: (count: number) => void;
}

/** Slider and braille preview for partial listing reservation. */
export default function ReserveAmountControl({
  unit,
  maxEggCount,
  eggCount,
  onEggCountChange,
}: ReserveAmountControlProps) {
  return (
    <Stack gap="3" w="full">
      <BrailleQuantityRow eggCount={eggCount} unit={unit} />
      <SliderWithValue
        min={1}
        max={maxEggCount}
        step={1}
        value={eggCount}
        onValueChange={onEggCountChange}
      />
    </Stack>
  );
}
