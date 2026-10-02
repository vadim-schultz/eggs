import { BRAILLE_BY_DOT_COUNT } from "./constants";

/** Tail braille cell for ``remainderDots`` eggs (0 returns empty). */
export function partialCellBraille(remainderDots: number): string {
  if (remainderDots === 0) {
    return "";
  }
  return BRAILLE_BY_DOT_COUNT[remainderDots as 1 | 2 | 3 | 4 | 5 | 6];
}
