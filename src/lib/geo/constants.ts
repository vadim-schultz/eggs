import type { GeoPoint } from "@/features/browse/types/geo";

/** Berlin fallback when geolocation is unavailable. */
export const DEFAULT_MAP_CENTER: GeoPoint = { lat: 52.52, lng: 13.405 };
