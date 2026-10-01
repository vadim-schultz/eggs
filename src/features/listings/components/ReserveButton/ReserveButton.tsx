import { Button } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import { useActiveReservation } from "@/features/listings/hooks/useActiveReservation";
import {
  cancelReservation,
  reserveListing,
} from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";
import { t } from "@/i18n/t";
import { useAsyncAction } from "@/lib/async/useAsyncAction";
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
  const { busy, error, run } = useAsyncAction();

  if (sessionLoading) return null;
  if (!session) {
    return <Button disabled>{t("reserve.signInRequired")}</Button>;
  }

  async function runMutation(action: () => Promise<{ error?: true }>) {
    await run(async () => {
      const result = await action();
      if (result.error) return { ok: false };
      onChange();
      return { ok: true };
    });
  }

  async function reserve() {
    await runMutation(() => reserveListing(listing.id));
  }

  async function cancel() {
    if (!reservation) return;
    await runMutation(() => cancelReservation(reservation.id));
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
