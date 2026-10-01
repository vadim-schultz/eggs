import type { ConfirmedPin } from "@/features/location/components/LocationPicker";
import type { ListingInput } from "@/features/listings/types/listingInput";

export interface PostListingFormState {
  eggCount: string;
  unit: "dozen" | "each";
  priceEuros: string;
  locationQuery: string;
  pin: ConfirmedPin | null;
  note: string;
  contactNote: string;
}

export function toListingInput(form: PostListingFormState): ListingInput {
  return {
    eggCount: Number(form.eggCount),
    unit: form.unit,
    priceCents: Math.round(Number(form.priceEuros || "0") * 100),
    locationLabel: form.locationQuery,
    note: form.note,
    contactNote: form.contactNote,
  };
}

export function toCreateListingArgs(input: ListingInput, pin: ConfirmedPin) {
  return {
    p_egg_count: input.eggCount,
    p_unit: input.unit,
    p_price_cents: input.priceCents,
    p_lat: pin.lat,
    p_lng: pin.lng,
    p_location_label: input.locationLabel,
    p_note: input.note.trim() ? input.note.trim() : null,
    p_contact_note: input.contactNote,
  };
}
