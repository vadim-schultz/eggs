import type { GeoPoint } from "@/features/browse/types/geo";

/** Read the browser position once; calls ``onFailure`` when unavailable or denied. */
export function readPosition(
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
