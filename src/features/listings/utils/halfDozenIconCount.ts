import type { ListingUnit } from "@/features/listings/types/listing";

/** Number of half-dozen egg icons to show (max 24). */
export function halfDozenIconCount(
  eggCount: number,
  unit: ListingUnit,
): number {
  const eggs = unit === "dozen" ? eggCount * 12 : eggCount;
  return Math.min(24, Math.ceil(eggs / 6));
}
