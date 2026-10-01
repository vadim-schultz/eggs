import { fetchListingContact } from "@/features/listings/services/listingsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

export function useListingContact(listingId: string) {
  const { data, loading } = useSupabaseQuery([listingId], () =>
    fetchListingContact(listingId).then(({ contact }) => contact),
  );

  return { contact: data, loading };
}
