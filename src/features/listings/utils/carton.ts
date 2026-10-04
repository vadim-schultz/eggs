export const CARTON_SIZES = [6, 10] as const;
export type CartonSize = (typeof CARTON_SIZES)[number];

export function cartonPriceCents(
  perEggCents: number,
  size: CartonSize,
): number {
  if (perEggCents < 0) throw new RangeError("perEggCents must be >= 0");
  return perEggCents * size;
}

export function isCartonAvailable(
  remaining: number,
  size: CartonSize,
): boolean {
  return remaining >= size;
}
