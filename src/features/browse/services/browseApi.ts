import { supabase } from "@/lib/supabaseClient";

import type { ListingNear } from "@/features/listings/types/listing";
import type { GeoPoint } from "@/features/browse/types/geo";

/** Load listings within ``radiusM`` of ``center`` via the ``listings_near`` RPC. */
export async function fetchListingsNear(
  center: GeoPoint,
  radiusM: number,
): Promise<{ listings: ListingNear[] } | { error: true }> {
  const { data, error } = await supabase.rpc("listings_near", {
    p_lat: center.lat,
    p_lng: center.lng,
    p_radius_m: radiusM,
  });
  if (error || !data) {
    return { error: true };
  }
  return { listings: data as ListingNear[] };
}
