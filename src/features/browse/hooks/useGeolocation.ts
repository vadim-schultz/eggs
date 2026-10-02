import { useCallback, useEffect, useState } from "react";

import type { GeoPoint } from "@/features/browse/types/geo";

export interface UseGeolocationResult {
  center: GeoPoint;
  loading: boolean;
  geoGranted: boolean;
  requestLocation: () => void;
}

function readPosition(
  onSuccess: (point: GeoPoint) => void,
  onFailure: () => void,
) {
  if (!navigator.geolocation) {
    onFailure();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => {
      onFailure();
    },
  );
}

/** Resolve browser geolocation with optional re-request via ``requestLocation``. */
export function useGeolocation(fallback: GeoPoint): UseGeolocationResult {
  const [center, setCenter] = useState<GeoPoint>(fallback);
  const [loading, setLoading] = useState(true);
  const [geoGranted, setGeoGranted] = useState(false);
  const [requestToken, setRequestToken] = useState(0);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setRequestToken((value) => value + 1);
  }, []);

  useEffect(() => {
    readPosition(
      (point) => {
        setCenter(point);
        setGeoGranted(true);
        setLoading(false);
      },
      () => {
        setCenter(fallback);
        setGeoGranted(false);
        setLoading(false);
      },
    );
  }, [fallback, requestToken]);

  return { center, loading, geoGranted, requestLocation };
}
