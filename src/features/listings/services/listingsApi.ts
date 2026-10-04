import { supabase } from "@/lib/supabaseClient";

import type { Listing } from "@/features/listings/types/listing";

export interface ListingContactRow {
  contact_note: string;
}

export interface CreateListingArgs {
  p_egg_count: number;
  p_unit: "dozen" | "each";
  p_price_per_egg_cents: number;
  p_lat: number;
  p_lng: number;
  p_location_label: string;
  p_note: string | null;
  p_contact_note: string;
}

export interface ActiveReservationRow {
  id: string;
  buyer_id: string;
}

export interface ListingReservationRow {
  id: string;
  egg_count: number;
  status: "active" | "cancelled";
  created_at: string;
}

export async function fetchListing(
  id: string,
): Promise<{ listing: Listing | null }> {
  const { data } = await supabase
    .from("listing")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .gt("egg_count", 0)
    .gt("expires_at", new Date().toISOString())
    .single();

  return { listing: (data as Listing | null) ?? null };
}

export async function fetchListingContact(
  listingId: string,
): Promise<{ contact: ListingContactRow | null }> {
  const { data } = await supabase
    .from("listing_contact")
    .select("contact_note")
    .eq("listing_id", listingId)
    .maybeSingle();

  return { contact: (data as ListingContactRow | null) ?? null };
}

export async function createListing(
  args: CreateListingArgs,
): Promise<{ id: string } | { error: true }> {
  const { data, error } = await supabase.rpc("create_listing", args);
  if (error || !data) {
    return { error: true };
  }
  return { id: data.id as string };
}

export async function fetchActiveReservation(
  listingId: string,
): Promise<{ reservation: ActiveReservationRow | null }> {
  const { data } = await supabase
    .from("reservation")
    .select("id, buyer_id")
    .eq("listing_id", listingId)
    .eq("status", "active")
    .maybeSingle();

  return { reservation: (data as ActiveReservationRow | null) ?? null };
}

export async function reserveListing(
  listingId: string,
  eggCount: number,
): Promise<{ error?: true }> {
  const { error } = await supabase.rpc("reserve_listing", {
    p_listing_id: listingId,
    p_egg_count: eggCount,
  });
  if (error) {
    return { error: true };
  }
  return {};
}

export async function cancelReservation(
  reservationId: string,
): Promise<{ error?: true }> {
  const { error } = await supabase.rpc("cancel_reservation", {
    p_reservation_id: reservationId,
  });
  if (error) {
    return { error: true };
  }
  return {};
}

export async function fetchListingReservations(
  listingId: string,
): Promise<{ reservations: ListingReservationRow[] }> {
  const { data } = await supabase
    .from("reservation")
    .select("id, egg_count, status, created_at")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  return { reservations: (data as ListingReservationRow[] | null) ?? [] };
}
