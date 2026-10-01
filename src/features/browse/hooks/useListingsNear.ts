import { fetchListingsNear } from "@/features/browse/services/browseApi";
import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

export interface UseListingsNearResult {
  listings: ListingNear[];
  loading: boolean;
  error: boolean;
}

export function useListingsNear(
  center: GeoPoint,
  radiusM: number,
): UseListingsNearResult {
  const { data, loading, error } = useSupabaseQuery(
    [center.lat, center.lng, radiusM],
    () => loadListingsNear(center, radiusM),
  );

  return { listings: data ?? [], loading, error };
}

async function loadListingsNear(
  center: GeoPoint,
  radiusM: number,
): Promise<ListingNear[]> {
  const result = await fetchListingsNear(center, radiusM);
  if ("error" in result) {
    throw new Error("listings_near failed");
  }
  return result.listings;
}
