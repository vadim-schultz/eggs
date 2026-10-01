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
