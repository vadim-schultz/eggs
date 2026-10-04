import { Text } from "@chakra-ui/react";

import type { SellerReservationRow as Row } from "@/features/listings/utils/reservationRows";
import { formatDateTime } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

export type SellerReservationRowProps = {
  reservation: Row;
};

export default function SellerReservationRow({
  reservation,
}: SellerReservationRowProps) {
  const { egg_count, location_label, created_at } = reservation;
  return (
    <Text fontSize="sm" data-testid="seller-reservation-row">
      {`${egg_count} ${t("listing.eggs.unit")} · ${location_label} · ${formatDateTime(created_at)}`}
    </Text>
  );
}
