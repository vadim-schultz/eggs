import {
  fetchBuyerReservations,
  type BuyerReservationRow,
} from "@/features/listings/services/reservationsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

const NONE: BuyerReservationRow[] = [];

export function useBuyerReservations(buyerId: string) {
  const { data, loading, refetch } = useSupabaseQuery([buyerId], async () => {
    const { reservations } = await fetchBuyerReservations(buyerId);
    return reservations;
  });

  return { reservations: data ?? NONE, loading, refetch };
}
