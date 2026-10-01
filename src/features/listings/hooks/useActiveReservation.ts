import {
  fetchActiveReservation,
  type ActiveReservationRow,
} from "@/features/listings/services/listingsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

export function useActiveReservation(listingId: string, enabled: boolean) {
  const { data, loading } = useSupabaseQuery([listingId, enabled], () =>
    loadActiveReservation(listingId, enabled),
  );

  if (!enabled) {
    return { reservation: null, loading: false };
  }

  return { reservation: data, loading };
}

async function loadActiveReservation(
  listingId: string,
  enabled: boolean,
): Promise<ActiveReservationRow | null> {
  if (!enabled) return null;
  const { reservation } = await fetchActiveReservation(listingId);
  return reservation;
}
