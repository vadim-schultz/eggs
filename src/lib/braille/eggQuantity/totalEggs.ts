import type { ListingUnit } from "@/features/listings/types/listing";

/** Total egg count for a listing amount (dozen → ×12). */
export function totalEggsFromListing(
  eggCount: number,
  unit: ListingUnit,
): number {
  return unit === "dozen" ? eggCount * 12 : eggCount;
}
