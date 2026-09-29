import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

import { useSession } from "../../auth/useSession";
import { t } from "../../i18n/t";
import { supabase } from "../../lib/supabaseClient";
import type { Listing } from "../../lib/listing";
import ReserveActionButton from "./ReserveActionButton";

interface ActiveReservation {
  id: string;
  buyer_id: string;
}

function useActiveReservation(listingId: string, enabled: boolean) {
  const [reservation, setReservation] = useState<ActiveReservation | null>(
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
    supabase
      .from("reservation")
      .select("id, buyer_id")
      .eq("listing_id", listingId)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setReservation((data as ActiveReservation | null) ?? null);
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

  async function callRpc(
    name: "reserve_listing" | "cancel_reservation",
    args: Record<string, string>,
  ) {
    setBusy(true);
    setError(false);
    const { error: rpcError } = await supabase.rpc(name, args);
    setBusy(false);
    if (rpcError) {
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
        onClick={() => callRpc("reserve_listing", { p_listing_id: listing.id })}
      />
    );
  }

  if (!reservationLoading && reservation) {
    return (
      <ReserveActionButton
        label={t("reserve.cancel")}
        busy={busy}
        error={error}
        onClick={() =>
          callRpc("cancel_reservation", { p_reservation_id: reservation.id })
        }
      />
    );
  }

  return <Button disabled>{t("reserve.reserved")}</Button>;
}
