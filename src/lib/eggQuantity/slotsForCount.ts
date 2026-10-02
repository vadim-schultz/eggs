import type { Slot } from "./types";

const SLOT_COUNT = 10;
const MIN_COUNT = 1;
const MAX_COUNT = 100;

/** Return ten decade slots for ``count`` (must be 1…100). */
export function slotsForCount(count: number): Slot[] {
  if (count < MIN_COUNT || count > MAX_COUNT) {
    throw new RangeError(
      `egg count must be between ${MIN_COUNT} and ${MAX_COUNT}`,
    );
  }

  const tens = Math.floor(count / 10);
  const rem = count % 10;

  return Array.from({ length: SLOT_COUNT }, (_, index) => ({
    index,
    kind: slotKind(index, tens, rem),
  }));
}

function slotKind(index: number, tens: number, rem: number): Slot["kind"] {
  if (index < tens) {
    return "filled";
  }
  if (index >= tens && index < tens + rem) {
    return "outline";
  }
  return "empty";
}
