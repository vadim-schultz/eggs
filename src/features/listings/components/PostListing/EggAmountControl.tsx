import { Stack } from "@chakra-ui/react";

import EggQuantityRow from "@/components/ui/EggQuantityRow";
import SliderWithValue from "@/components/ui/SliderWithValue";
import { clampCount } from "@/lib/eggQuantity";

export interface EggAmountControlProps {
  eggCount: number;
  onEggCountChange: (count: number) => void;
}

/** Full-width egg decade row and 1…100 count slider for the post listing dialog. */
export default function EggAmountControl({
  eggCount,
  onEggCountChange,
}: EggAmountControlProps) {
  return (
    <Stack data-testid="post-listing-egg-amount" gap="3" w="full">
      <EggQuantityRow count={clampCount(eggCount)} />
      <SliderWithValue
        min={1}
        max={100}
        step={1}
        editable
        value={eggCount}
        onValueChange={onEggCountChange}
      />
    </Stack>
  );
}
