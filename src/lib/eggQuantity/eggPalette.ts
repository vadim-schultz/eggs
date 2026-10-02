/** Easter egg semantic colour names in slot-cycling order (index % 12). */
export const EGG_PALETTE_COLOR_NAMES = [
  "blush",
  "coral",
  "rose",
  "burgundy",
  "rust",
  "goldenrod",
  "seafoam",
  "cornflower",
  "mint",
  "jade",
  "emerald",
  "navy",
] as const;

export type EggPaletteColorName = (typeof EGG_PALETTE_COLOR_NAMES)[number];

/** Semantic token path for the egg icon at ``slotIndex``. */
export function eggColorForSlot(
  slotIndex: number,
): `egg.${EggPaletteColorName}` {
  const name =
    EGG_PALETTE_COLOR_NAMES[slotIndex % EGG_PALETTE_COLOR_NAMES.length];
  return `egg.${name}`;
}
