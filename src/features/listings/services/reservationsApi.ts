import { supabase } from "@/lib/supabaseClient";

import {
  toBuyerRow,
  toSellerRow,
  type BuyerReservationRow,
  type ReservationEmbed,
  type SellerReservationRow,
} from "@/features/listings/utils/reservationRows";

export type { BuyerReservationRow, SellerReservationRow };

const SELLER_SELECT =
  "id, egg_count, created_at, listing_id, listing!inner(location_label, seller_id, expires_at)";
const BUYER_SELECT =
  "id, egg_count, created_at, listing_id, listing!inner(location_label, expires_at, listing_contact(contact_note))";

export async function fetchSellerReservations(
  sellerId: string,
): Promise<{ reservations: SellerReservationRow[] }> {
  const { data } = await supabase
    .from("reservation")
    .select(SELLER_SELECT)
    .eq("status", "active")
    .eq("listing.seller_id", sellerId)
    .gt("listing.expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  const rows = (data as ReservationEmbed[] | null) ?? [];
  return { reservations: rows.map(toSellerRow) };
}

export async function fetchBuyerReservations(
  buyerId: string,
): Promise<{ reservations: BuyerReservationRow[] }> {
  const { data } = await supabase
    .from("reservation")
    .select(BUYER_SELECT)
    .eq("status", "active")
    .eq("buyer_id", buyerId)
    .gt("listing.expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  const rows = (data as ReservationEmbed[] | null) ?? [];
  return { reservations: rows.map(toBuyerRow) };
}
