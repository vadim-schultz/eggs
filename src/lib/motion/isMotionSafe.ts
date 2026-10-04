const NO_PREFERENCE = "(prefers-reduced-motion: no-preference)";

/** True unless the browser reports a reduced-motion preference. */
export function isMotionSafe(): boolean {
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia(NO_PREFERENCE).matches;
}
