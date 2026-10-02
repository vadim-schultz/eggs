import { Button, Flex, Icon, Slider, Stack } from "@chakra-ui/react";
import { TbEgg } from "react-icons/tb";

import type { Unit } from "@/features/listings/types";
import { halfDozenIconCount } from "@/features/listings/utils/halfDozenIconCount";
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
  const iconCount = halfDozenIconCount(eggCount, unit);

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
      <Flex gap="1" flexWrap="wrap" minH="6">
        {Array.from({ length: iconCount }, (_, index) => (
          <Icon key={index} as={TbEgg} boxSize="5" color="orange.500" />
        ))}
      </Flex>
      <Slider.Root
        min={1}
        max={12}
        step={1}
        value={[eggCount]}
        onValueChange={(details) => onEggCountChange(details.value[0] ?? 1)}
        w="full"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
