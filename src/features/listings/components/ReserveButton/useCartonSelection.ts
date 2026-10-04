import { useState } from "react";

import {
  CARTON_SIZES,
  isCartonAvailable,
  type CartonSize,
} from "@/features/listings/utils/carton";

function firstAvailable(remaining: number): CartonSize | null {
  return CARTON_SIZES.find((s) => isCartonAvailable(remaining, s)) ?? null;
}

/** Selected carton; falls back to the first available one when stock drops. */
export function useCartonSelection(remaining: number) {
  const [picked, setPicked] = useState<CartonSize | null>(() =>
    firstAvailable(remaining),
  );
  const selected =
    picked !== null && isCartonAvailable(remaining, picked)
      ? picked
      : firstAvailable(remaining);
  return [selected, setPicked] as const;
}
