import { Button, Flex, Stack } from "@chakra-ui/react";

import BrailleQuantityRow from "@/components/ui/BrailleQuantityRow";
import SliderWithValue from "@/components/ui/SliderWithValue";

import type { Unit } from "@/features/listings/types";
import { t } from "@/i18n/t";

export interface EggAmountControlProps {
  unit: Unit;
  eggCount: number;
  onUnitChange: (unit: Unit) => void;
  onEggCountChange: (count: number) => void;
}

function UnitChip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      rounded="full"
      flex="1"
      colorPalette={pressed ? "orange" : "gray"}
      variant={pressed ? "solid" : "subtle"}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default function EggAmountControl({
  unit,
  eggCount,
  onUnitChange,
  onEggCountChange,
}: EggAmountControlProps) {
  return (
    <Stack gap="3" w="full">
      <Flex gap="2">
        <UnitChip
          label={t("post.unit.each")}
          pressed={unit === "each"}
          onClick={() => onUnitChange("each")}
        />
        <UnitChip
          label={t("post.unit.dozen")}
          pressed={unit === "dozen"}
          onClick={() => onUnitChange("dozen")}
        />
      </Flex>
      <BrailleQuantityRow eggCount={eggCount} unit={unit} />
      <SliderWithValue
        min={1}
        max={12}
        step={1}
        value={eggCount}
        onValueChange={onEggCountChange}
      />
    </Stack>
  );
}
