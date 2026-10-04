import { Box, Flex } from "@chakra-ui/react";
import { TbEgg, TbEggFilled } from "react-icons/tb";

import { clampCount, eggColorForSlot, slotsForCount } from "@/lib/eggQuantity";
import type { Slot } from "@/lib/eggQuantity";

export interface EggQuantityRowProps {
  count: number;
}

const ICON_SIZE = 20;

/** Full-width row of up to ten colourful decade egg icons for ``count`` (1…100). */
export default function EggQuantityRow({ count }: EggQuantityRowProps) {
  const slots = slotsForCount(clampCount(count));

  return (
    <Flex
      align="center"
      data-testid="egg-quantity-row"
      gap="0.5"
      justify="flex-start"
      w="full"
    >
      {slots.map((slot) => (
        <Box key={slot.index} flex="1" minW={0} textAlign="center">
          <EggSlot slot={slot} />
        </Box>
      ))}
    </Flex>
  );
}

function EggSlot({ slot }: { slot: Slot }) {
  if (slot.kind === "empty") {
    return <Box aria-hidden minH={`${ICON_SIZE}px`} />;
  }

  const color = eggColorForSlot(slot.index);
  const Icon = slot.kind === "filled" ? TbEggFilled : TbEgg;
  const testId =
    slot.kind === "filled" ? "egg-quantity-filled" : "egg-quantity-outline";

  return (
    <Box
      aria-hidden
      color={color}
      data-testid={testId}
      css={{
        _motionSafe: { _hover: { animation: "wiggle 0.5s ease-in-out" } },
      }}
      display="inline-flex"
      justifyContent="center"
    >
      <Icon size={ICON_SIZE} />
    </Box>
  );
}
