import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import {
  cancelReservation,
  fetchActiveReservation,
  reserveListing,
} from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";
import { t } from "../../i18n/t";
import ReserveActionButton from "./ReserveActionButton";

function useActiveReservation(listingId: string, enabled: boolean) {
  const [reservation, setReservation] =
    useState<Awaited<ReturnType<typeof fetchActiveReservation>>["reservation"]>(
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

interface ReserveButtonProps {
  listing: Listing;
  onChange: () => void;
}

export default function ReserveButton({
  listing,
  onChange,
}: ReserveButtonProps) {
  const { session, loading: sessionLoading } = useSession();
  const isActive = listing.status === "active";
  const { reservation, loading: reservationLoading } = useActiveReservation(
    listing.id,
    Boolean(session) && !isActive,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  if (sessionLoading) return null;
  if (!session) {
    return <Button disabled>{t("reserve.signInRequired")}</Button>;
  }

  async function reserve() {
    setBusy(true);
    setError(false);
    const result = await reserveListing(listing.id);
    setBusy(false);
    if (result.error) {
      setError(true);
      return;
    }
    onChange();
  }

  async function cancel() {
    if (!reservation) return;
    setBusy(true);
    setError(false);
    const result = await cancelReservation(reservation.id);
    setBusy(false);
    if (result.error) {
      setError(true);
      return;
    }
    onChange();
  }

  if (isActive) {
    return (
      <ReserveActionButton
        label={t("reserve.reserve")}
        busy={busy}
        error={error}
        onClick={reserve}
      />
    );
  }

  if (!reservationLoading && reservation) {
    return (
      <ReserveActionButton
        label={t("reserve.cancel")}
        busy={busy}
        error={error}
        onClick={cancel}
      />
    );
  }

  return <Button disabled>{t("reserve.reserved")}</Button>;
}
