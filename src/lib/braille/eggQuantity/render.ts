import { BRAILLE_BY_DOT_COUNT } from "./constants";
import { partialCellBraille } from "./partialCell";

/**
 * Braille string for ``totalEggs``: full six-dot cells plus optional tail.
 *
 * Same full-block + tail shape as htmlrec ``block_char``; this app uses 6-dot patterns only.
 */
export function renderEggQuantityBraille(totalEggs: number): string {
  const fullCells = Math.floor(totalEggs / 6);
  const remainder = totalEggs % 6;
  const fullPart = BRAILLE_BY_DOT_COUNT[6].repeat(fullCells);
  return fullPart + partialCellBraille(remainder);
}
