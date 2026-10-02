/** Whether ``eggCount`` is a valid partial-reserve quantity for a listing. */
export function isReserveCountValid(
  eggCount: number,
  maxEggCount: number,
): boolean {
  return eggCount >= 1 && eggCount <= maxEggCount;
}
