export const RAMP_STOPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

const WHITE = "#FFFFFF";
const WARM_SHADE = "#2A1218";
const HEX = /^#[0-9a-f]{6}$/i;

/** Share of the anchor kept, per stop (1 = anchor, 0 = target colour). */
const LIGHT_MIX: Record<number, number> = {
  50: 0.1,
  100: 0.22,
  200: 0.42,
  300: 0.62,
  400: 0.82,
};
const DARK_MIX: Record<number, number> = {
  600: 0.86,
  700: 0.7,
  800: 0.52,
  900: 0.34,
  950: 0.18,
};

function channels(hex: string): number[] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function mix(anchor: string, target: string, keep: number): string {
  const [a, b] = [channels(anchor), channels(target)];
  const out = a.map((c, i) => Math.round(c * keep + b[i] * (1 - keep)));
  return `#${out.map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function stopValue(anchor: string, stop: number): string {
  if (stop in LIGHT_MIX) return mix(anchor, WHITE, LIGHT_MIX[stop]);
  if (stop in DARK_MIX) return mix(anchor, WARM_SHADE, DARK_MIX[stop]);
  return anchor;
}

/** Full Chakra colour ramp (50..950) with `anchor` at 500. */
export function ramp(anchor: string) {
  if (!HEX.test(anchor)) throw new Error(`ramp: invalid hex "${anchor}"`);
  const stops = RAMP_STOPS.map((s) => [s, { value: stopValue(anchor, s) }]);
  return {
    DEFAULT: { value: anchor },
    ...Object.fromEntries(stops),
  } as Record<(typeof RAMP_STOPS)[number], { value: string }> & {
    DEFAULT: { value: string };
  };
}
