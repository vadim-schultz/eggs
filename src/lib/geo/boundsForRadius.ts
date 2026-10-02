import type { GeoPoint } from "@/features/browse/types/geo";

const METERS_PER_DEGREE_LAT = 111_320;

/** Southwest and northeast corners for Leaflet ``fitBounds``. */
export type LatLngBounds = [[number, number], [number, number]];

/** Return a square centered on ``center`` with half-width ``radiusM`` (meters). */
export function boundsForRadius(
  center: GeoPoint,
  radiusM: number,
): LatLngBounds {
  const latRad = (center.lat * Math.PI) / 180;
  const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.cos(latRad);
  const deltaLat = radiusM / METERS_PER_DEGREE_LAT;
  const deltaLng = radiusM / metersPerDegreeLng;
  return [
    [center.lat - deltaLat, center.lng - deltaLng],
    [center.lat + deltaLat, center.lng + deltaLng],
  ];
}
