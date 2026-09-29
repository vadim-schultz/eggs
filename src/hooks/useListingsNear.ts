import { useEffect, useState } from "react";

import { supabase } from "../lib/supabaseClient";
import type { Listing } from "../lib/listing";
import type { GeoPoint } from "./useGeolocation";

export interface UseListingsNearResult {
  listings: Listing[];
  loading: boolean;
  error: boolean;
}

export function useListingsNear(
  center: GeoPoint,
  radiusM: number,
): UseListingsNearResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    supabase
      .rpc("listings_near", {
        lat: center.lat,
        lng: center.lng,
        radius_m: radiusM,
      })
      .then(({ data, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError || !data) {
          setError(true);
        } else {
          setListings(data as Listing[]);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [center.lat, center.lng, radiusM]);

  return { listings, loading, error };
}
