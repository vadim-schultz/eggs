import type {
  ConfirmedPin,
  PlaceCandidate,
} from "@/features/location/types/place";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

/** Search OpenStreetMap Nominatim for place candidates matching ``query``. */
export async function searchPlace(query: string): Promise<PlaceCandidate[]> {
  if (!query.trim()) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) return [];

  const results = (await response.json()) as NominatimResult[];
  return results.map((result) => ({
    label: result.display_name,
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
  }));
}

interface NominatimReverseResult {
  display_name: string;
}

/** Resolve a human-readable place for ``point``, or null when unavailable. */
export async function reverseGeocode(
  point: ConfirmedPin,
): Promise<PlaceCandidate | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const result = (await response.json()) as NominatimReverseResult;
  return { label: result.display_name, lat: point.lat, lng: point.lng };
}
