import { Button, Stack } from "@chakra-ui/react";
import { useState } from "react";

import EggBurst from "@/components/ui/EggBurst";
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
import ReserveAmountControl from "./ReserveAmountControl";
import { isReserveCountValid } from "./reserveCount";

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
  const [reserveCount, setReserveCount] = useState(1);
  const { reservation, loading: reservationLoading } = useActiveReservation(
    listing.id,
    Boolean(session) && !isActive,
  );
  const [burst, setBurst] = useState(false);
  const { busy, error, run } = useAsyncAction();

  if (sessionLoading) return null;
  if (!session) {
    return <Button disabled>{t("reserve.signInRequired")}</Button>;
  }

  const burstOverlay = (
    <EggBurst active={burst} count={6} onDone={() => setBurst(false)} />
  );

  async function runMutation(
    action: () => Promise<{ error?: true }>,
    celebrate = false,
  ) {
    await run(async () => {
      const result = await action();
      if (result.error) return { ok: false };
      if (celebrate) setBurst(true);
      onChange();
      return { ok: true };
    });
  }

  async function reserve() {
    if (!isReserveCountValid(reserveCount, listing.egg_count)) return;
    await runMutation(() => reserveListing(listing.id, reserveCount), true);
  }

  async function cancel() {
    if (!reservation) return;
    await runMutation(() => cancelReservation(reservation.id));
  }

  if (isActive) {
    const canSubmit = isReserveCountValid(reserveCount, listing.egg_count);

    return (
      <Stack gap="3" w="full">
        {burstOverlay}
        <ReserveAmountControl
          unit={listing.unit}
          maxEggCount={listing.egg_count}
          eggCount={reserveCount}
          onEggCountChange={setReserveCount}
        />
        <ReserveActionButton
          label={t("reserve.reserve")}
          busy={busy}
          error={error}
          disabled={!canSubmit}
          onClick={reserve}
        />
      </Stack>
    );
  }

  if (!reservationLoading && reservation) {
    return (
      <>
        {burstOverlay}
        <ReserveActionButton
          label={t("reserve.cancel")}
          busy={busy}
          error={error}
          onClick={cancel}
        />
      </>
    );
  }

  return <Button disabled>{t("reserve.reserved")}</Button>;
}
