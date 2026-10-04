import { Stack, Text } from "@chakra-ui/react";

import type { SellerReservationRow as Row } from "@/features/listings/utils/reservationRows";
import { t } from "@/i18n/t";

import SellerReservationRow from "./SellerReservationRow";

export type SellerReservationListProps = {
  reservations: Row[];
  showEmpty?: boolean;
};

export default function SellerReservationList({
  reservations,
  showEmpty = false,
}: SellerReservationListProps) {
  if (reservations.length === 0 && !showEmpty) return null;

  return (
    <Stack gap="1">
      <Text fontWeight="medium" fontSize="sm">
        {t("sellerView.reservations.title")}
      </Text>
      {reservations.length === 0 ? (
        <Text color="fg.muted" fontSize="sm">
          {t("sellerView.reservations.empty")}
        </Text>
      ) : (
        reservations.map((r) => (
          <SellerReservationRow key={r.id} reservation={r} />
        ))
      )}
    </Stack>
  );
}
