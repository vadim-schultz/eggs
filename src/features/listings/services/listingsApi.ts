import { supabase } from "@/lib/supabaseClient";

import type { Listing } from "@/features/listings/types/listing";

export interface ListingContactRow {
  contact_note: string;
}

export async function fetchListing(
  id: string,
): Promise<{ listing: Listing | null }> {
  const { data } = await supabase
    .from("listing")
    .select("*")
    .eq("id", id)
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
