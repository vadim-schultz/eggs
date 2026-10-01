import { useEffect, useState } from "react";

import {
  fetchActiveReservation,
  type ActiveReservationRow,
} from "@/features/listings/services/listingsApi";

export function useActiveReservation(listingId: string, enabled: boolean) {
  const [reservation, setReservation] = useState<ActiveReservationRow | null>(
    null,
  );
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setReservation(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchActiveReservation(listingId).then(({ reservation: row }) => {
      if (cancelled) return;
      setReservation(row);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [listingId, enabled]);

  return { reservation, loading };
}
