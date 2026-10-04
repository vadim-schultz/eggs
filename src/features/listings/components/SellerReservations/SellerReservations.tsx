import { HStack, Stack, Text } from "@chakra-ui/react";

import type { ListingReservationRow } from "@/features/listings/services/listingsApi";
import { formatDateTime } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

export type SellerReservationsProps = {
  reservations: ListingReservationRow[];
};

export default function SellerReservations({
  reservations,
}: SellerReservationsProps) {
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
          <HStack
            key={r.id}
            data-testid="seller-reservation-row"
            justify="space-between"
            fontSize="sm"
          >
            <Text>{`${r.egg_count} ${t("listing.eggs.unit")}`}</Text>
            <Text color="fg.muted">{formatDateTime(r.created_at)}</Text>
            <Text>{t(`sellerView.reservation.${r.status}`)}</Text>
          </HStack>
        ))
      )}
    </Stack>
  );
}
