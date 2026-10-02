const MIN_COUNT = 1;
const MAX_COUNT = 100;

/** Clamp a display count to the supported egg row range (1…100). */
export function clampCount(count: number): number {
  if (count < MIN_COUNT) {
    return MIN_COUNT;
  }
  if (count > MAX_COUNT) {
    return MAX_COUNT;
  }
  return count;
}
