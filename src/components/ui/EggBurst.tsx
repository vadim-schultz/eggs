import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { TbEggFilled } from "react-icons/tb";

import { eggColorForSlot } from "@/lib/eggQuantity";
import { isMotionSafe } from "@/lib/motion/isMotionSafe";

export interface EggBurstProps {
  active: boolean;
  count?: number;
  /** Called after one animation cycle so the owner can reset its trigger. */
  onDone?: () => void;
}

const CYCLE_MS = 1400;
const STAGGER_MS = 80;

/** CSS-only burst of palette-coloured eggs; the owner controls `active`. */
export default function EggBurst({ active, count = 6, onDone }: EggBurstProps) {
  const visible = active && isMotionSafe();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => onDone?.(), CYCLE_MS);
    return () => clearTimeout(timer);
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <Box
      aria-hidden
      data-testid="egg-burst"
      inset="0"
      overflow="hidden"
      pointerEvents="none"
      position="fixed"
      zIndex="toast"
    >
      {Array.from({ length: count }, (_, i) => (
        <BurstEgg key={i} index={i} count={count} />
      ))}
    </Box>
  );
}

function BurstEgg({ index, count }: { index: number; count: number }) {
  const color = eggColorForSlot(index);

  return (
    <Box
      animation={`pop ${CYCLE_MS - 400}ms ease-out both`}
      animationDelay={`${index * STAGGER_MS}ms`}
      bottom="20%"
      color={color}
      data-egg-color={color}
      data-testid="egg-burst-egg"
      left={`${((index + 1) / (count + 1)) * 100}%`}
      position="absolute"
    >
      <TbEggFilled size={32} />
    </Box>
  );
}
