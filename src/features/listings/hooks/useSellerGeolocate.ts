import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";
import { readPosition } from "@/features/location/services/readPosition";
import { reverseGeocode } from "@/features/location/services/geocodeApi";
import type { ConfirmedPin } from "@/features/location/types/place";

type FieldChange = <K extends keyof PostListingFormState>(
  key: K,
  value: PostListingFormState[K],
) => void;

async function applyPosition(point: ConfirmedPin, onFieldChange: FieldChange) {
  onFieldChange("pin", point);
  const place = await reverseGeocode(point).catch(() => null);
  if (place) onFieldChange("locationQuery", place.label);
}

/** Returns a handler that fills the post form's Ort from the browser position. */
export function useSellerGeolocate(onFieldChange: FieldChange) {
  return () =>
    readPosition(
      (point) => void applyPosition(point, onFieldChange),
      () => {},
    );
}
