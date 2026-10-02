import type { GeoPoint } from "@/features/browse/types/geo";

/** Southwest and northeast corners of Germany (approximate). */
export const GERMANY_BOUNDS: [[number, number], [number, number]] = [
  [47.27, 5.87],
  [55.06, 15.04],
];

/** Center of Germany when geolocation is unavailable. */
export function germanyCenter(): GeoPoint {
  const [[south, west], [north, east]] = GERMANY_BOUNDS;
  return { lat: (south + north) / 2, lng: (west + east) / 2 };
}

/** Default map center when no user location is available. */
export const DEFAULT_MAP_CENTER: GeoPoint = germanyCenter();
