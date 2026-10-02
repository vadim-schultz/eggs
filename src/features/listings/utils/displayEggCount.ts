import type { ListingUnit } from "@/features/listings/types/listing";
import { clampCount } from "@/lib/eggQuantity";

/** Egg count for decade row display (legacy dozen → ×12, capped at 100). */
export function displayEggCount(eggCount: number, unit: ListingUnit): number {
  const total = unit === "dozen" ? eggCount * 12 : eggCount;
  return clampCount(total);
}
