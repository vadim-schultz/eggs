import {
  fetchListingReservations,
  type ListingReservationRow,
} from "@/features/listings/services/listingsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

const NONE: ListingReservationRow[] = [];

export function useListingReservations(listingId: string) {
  const { data, loading } = useSupabaseQuery([listingId], async () => {
    const { reservations } = await fetchListingReservations(listingId);
    return reservations;
  });

  return { reservations: data ?? NONE, loading };
}
