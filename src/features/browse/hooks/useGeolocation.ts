import { useEffect, useState } from "react";

import type { GeoPoint } from "@/features/browse/types/geo";

export interface UseGeolocationResult {
  center: GeoPoint;
  loading: boolean;
}

export function useGeolocation(fallback: GeoPoint): UseGeolocationResult {
  const [center, setCenter] = useState<GeoPoint>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );
  }, []);

  return { center, loading };
}
