export type ListingUnit = "dozen" | "each";
export type ListingStatus =
  | "active"
  | "reserved"
  | "sold"
  | "expired"
  | "cancelled";

export interface Listing {
  id: string;
  seller_id: string;
  egg_count: number;
  unit: ListingUnit;
  price_cents: number;
  currency: string;
  location: { type: "Point"; coordinates: [number, number] };
  location_label: string;
  note: string | null;
  status: ListingStatus;
  created_at: string;
  expires_at: string;
}

export function formatPrice(priceCents: number, currency: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function unitLabelKey(unit: ListingUnit): "post.unit.dozen" | "post.unit.each" {
  return unit === "dozen" ? "post.unit.dozen" : "post.unit.each";
}

export function statusLabelKey(
  status: ListingStatus,
): `listing.status.${ListingStatus}` {
  return `listing.status.${status}`;
}
