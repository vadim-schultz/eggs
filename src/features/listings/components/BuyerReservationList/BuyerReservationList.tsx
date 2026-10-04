import { Stack } from "@chakra-ui/react";

import type { BuyerReservationRow as Row } from "@/features/listings/utils/reservationRows";

import BuyerReservationRow from "./BuyerReservationRow";

export type BuyerReservationListProps = {
  reservations: Row[];
  onChange: () => void;
};

export default function BuyerReservationList({
  reservations,
  onChange,
}: BuyerReservationListProps) {
  if (reservations.length === 0) return null;

  return (
    <Stack gap="3">
      {reservations.map((r) => (
        <BuyerReservationRow key={r.id} reservation={r} onChange={onChange} />
      ))}
    </Stack>
  );
}
