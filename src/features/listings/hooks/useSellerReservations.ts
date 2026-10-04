import {
  fetchSellerReservations,
  type SellerReservationRow,
} from "@/features/listings/services/reservationsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

const NONE: SellerReservationRow[] = [];

export function useSellerReservations(sellerId: string) {
  const { data, loading, refetch } = useSupabaseQuery([sellerId], async () => {
    const { reservations } = await fetchSellerReservations(sellerId);
    return reservations;
  });

  return { reservations: data ?? NONE, loading, refetch };
}
