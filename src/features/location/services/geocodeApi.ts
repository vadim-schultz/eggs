import type { PlaceCandidate } from "@/features/location/types/place";

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
