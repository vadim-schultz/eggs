import type { ListingStatus, ListingUnit } from "../types/listing";

export function formatPrice(priceCents: number, currency: string): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export function unitLabelKey(
  unit: ListingUnit,
): "post.unit.dozen" | "post.unit.each" {
  return unit === "dozen" ? "post.unit.dozen" : "post.unit.each";
}

export function statusLabelKey(
  status: ListingStatus,
): `listing.status.${ListingStatus}` {
  return `listing.status.${status}`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}
