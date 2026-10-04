export type ListingUnit = "dozen" | "each";
export type ListingStatus =
  "active" | "reserved" | "sold" | "expired" | "cancelled";

export interface Listing {
  id: string;
  seller_id: string;
  egg_count: number;
  unit: ListingUnit;
  price_per_egg_cents: number;
  currency: string;
  location_label: string;
  note: string | null;
  status: ListingStatus;
  created_at: string;
  expires_at: string;
}

/** A `Listing` as returned by the `listings_near` RPC: adds plain lat/lng,
 * since PostgREST doesn't auto-encode a function's geography output column
 * as GeoJSON the way it does for a table's own column (see the chapter 5
 * migration that added these two columns). */
export interface ListingNear extends Listing {
  lat: number;
  lng: number;
}
