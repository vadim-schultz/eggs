import { Stack } from "@chakra-ui/react";

import EggQuantityRow from "@/components/ui/EggQuantityRow";
import SliderWithValue from "@/components/ui/SliderWithValue";

import type { ListingUnit } from "@/features/listings/types/listing";
import { displayEggCount } from "@/features/listings/utils/displayEggCount";

export interface ReserveAmountControlProps {
  unit: ListingUnit;
  maxEggCount: number;
  eggCount: number;
  onEggCountChange: (count: number) => void;
}

/** Slider and egg row preview for partial listing reservation. */
export default function ReserveAmountControl({
  unit,
  maxEggCount,
  eggCount,
  onEggCountChange,
}: ReserveAmountControlProps) {
  return (
    <Stack gap="3" w="full">
      <EggQuantityRow count={displayEggCount(eggCount, unit)} />
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
