import { Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import EggBurst from "@/components/ui/EggBurst";
import { CartonPicker } from "@/features/listings/components/CartonPicker";
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
import { useCartonSelection } from "./useCartonSelection";

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
  const [carton, setCarton] = useCartonSelection(listing.egg_count);
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
    if (carton === null) return;
    await runMutation(() => reserveListing(listing.id, carton), true);
  }

  async function cancel() {
    if (!reservation) return;
    await runMutation(() => cancelReservation(reservation.id));
  }

  if (isActive) {
    return (
      <Stack gap="3" w="full">
        {burstOverlay}
        <CartonPicker
          remaining={listing.egg_count}
          pricePerEggCents={listing.price_per_egg_cents}
          currency={listing.currency}
          value={carton}
          onChange={setCarton}
        />
        {carton === null && (
          <Text color="fg.muted" fontSize="sm">
            {t("reserve.noCarton")}
          </Text>
        )}
        <ReserveActionButton
          label={t("reserve.reserve")}
          busy={busy}
          error={error}
          disabled={carton === null}
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
