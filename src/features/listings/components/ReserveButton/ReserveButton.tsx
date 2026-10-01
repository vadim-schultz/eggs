import { useState } from "react";
import { Button } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import { useActiveReservation } from "@/features/listings/hooks/useActiveReservation";
import {
  cancelReservation,
  reserveListing,
} from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";
import { t } from "@/i18n/t";
import ReserveActionButton from "./ReserveActionButton";

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
