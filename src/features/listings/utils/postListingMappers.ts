import type { ConfirmedPin } from "@/features/location/types/place";
import type { ListingInput } from "@/features/listings/types/listingInput";

export interface PostListingFormState {
  eggCount: number;
  unit: "dozen" | "each";
  priceEuros: string;
  locationQuery: string;
  pin: ConfirmedPin | null;
  contactNote: string;
}

export function toListingInput(form: PostListingFormState): ListingInput {
  return {
    eggCount: form.eggCount,
    unit: "each",
    pricePerEggCents: Math.round(Number(form.priceEuros || "0") * 100),
    locationLabel: form.locationQuery,
    note: "",
    contactNote: form.contactNote,
  };
}

export function toCreateListingArgs(input: ListingInput, pin: ConfirmedPin) {
  return {
    p_egg_count: input.eggCount,
    p_unit: input.unit,
    p_price_per_egg_cents: input.pricePerEggCents,
    p_lat: pin.lat,
    p_lng: pin.lng,
    p_location_label: input.locationLabel,
    p_note: null as string | null,
    p_contact_note: input.contactNote,
  };
}
