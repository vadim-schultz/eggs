export interface ListingInput {
  eggCount: number;
  unit: "dozen" | "each";
  priceCents: number;
  locationLabel: string;
  note: string;
  contactNote: string;
}

export type ListingErrorKey =
  | "post.errors.eggCount"
  | "post.errors.priceCents"
  | "post.errors.locationLabel"
  | "post.errors.contactNote";

export type ListingInputErrors = Partial<
  Record<
    "eggCount" | "priceCents" | "locationLabel" | "contactNote",
    ListingErrorKey
  >
>;

export function validateListingInput(input: ListingInput): ListingInputErrors {
  const errors: ListingInputErrors = {};

  if (!(input.eggCount > 0)) errors.eggCount = "post.errors.eggCount";
  if (input.priceCents < 0) errors.priceCents = "post.errors.priceCents";
  if (!input.locationLabel.trim())
    errors.locationLabel = "post.errors.locationLabel";
  if (!input.contactNote.trim()) errors.contactNote = "post.errors.contactNote";

  return errors;
}
