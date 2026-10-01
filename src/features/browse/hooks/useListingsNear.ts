import { useEffect, useState } from "react";

import { fetchListingsNear } from "@/features/browse/services/browseApi";
import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";

export interface UseListingsNearResult {
  listings: ListingNear[];
  loading: boolean;
  error: boolean;
}

export function useListingsNear(
  center: GeoPoint,
  radiusM: number,
): UseListingsNearResult {
  const [listings, setListings] = useState<ListingNear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchListingsNear(center, radiusM).then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setError(true);
      } else {
        setListings(result.listings);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lng, radiusM]);

  return { listings, loading, error };
}
