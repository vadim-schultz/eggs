import { Button, Stack, Text } from "@chakra-ui/react";

import { cancelReservation } from "@/features/listings/services/listingsApi";
import { formatDateTime } from "@/features/listings/utils/formatListing";
import type { BuyerReservationRow as Row } from "@/features/listings/utils/reservationRows";
import { t } from "@/i18n/t";
import { useAsyncAction } from "@/lib/async/useAsyncAction";

export type BuyerReservationRowProps = {
  reservation: Row;
  onChange: () => void;
};

export default function BuyerReservationRow({
  reservation,
  onChange,
}: BuyerReservationRowProps) {
  const { id, egg_count, location_label, created_at, contact_note } =
    reservation;
  const { busy, error, run } = useAsyncAction();

  function cancel() {
    return run(async () => {
      const result = await cancelReservation(id);
      if (result.error) return { ok: false };
      onChange();
      return { ok: true };
    });
  }

  return (
    <Stack gap="1" data-testid="buyer-reservation-row">
      <Text fontSize="sm">
        {`${egg_count} ${t("listing.eggs.unit")} · ${location_label} · ${formatDateTime(created_at)}`}
      </Text>
      {contact_note && (
        <Text fontSize="sm" color="fg.muted">
          {`${t("reserve.contactNote.label")}: ${contact_note}`}
        </Text>
      )}
      <Button size="xs" variant="outline" disabled={busy} onClick={cancel}>
        {t("reserve.cancel")}
      </Button>
      {error && (
        <Text fontSize="sm" color="fg.error">
          {t("reserve.error")}
        </Text>
      )}
    </Stack>
  );
}
