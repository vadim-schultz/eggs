import type { ListingInput, ListingInputErrors } from "../types/listingInput";

export function validateListingInput(input: ListingInput): ListingInputErrors {
  const errors: ListingInputErrors = {};

  if (!(input.eggCount > 0)) errors.eggCount = "post.errors.eggCount";
  if (input.priceCents < 0) errors.priceCents = "post.errors.priceCents";
  if (!input.locationLabel.trim())
    errors.locationLabel = "post.errors.locationLabel";
  if (!input.contactNote.trim()) errors.contactNote = "post.errors.contactNote";

  return errors;
}
