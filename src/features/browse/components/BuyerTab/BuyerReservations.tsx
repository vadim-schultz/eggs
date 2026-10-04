import { useEffect, useRef } from "react";

import BuyerReservationList from "@/features/listings/components/BuyerReservationList";
import { useBuyerReservations } from "@/features/listings/hooks/useBuyerReservations";

type BuyerReservationsProps = {
  buyerId: string;
  dialogOpen: boolean;
};

export default function BuyerReservations({
  buyerId,
  dialogOpen,
}: BuyerReservationsProps) {
  const { reservations, refetch } = useBuyerReservations(buyerId);
  const wasOpen = useRef(dialogOpen);

  useEffect(() => {
    if (wasOpen.current && !dialogOpen) refetch();
    wasOpen.current = dialogOpen;
  }, [dialogOpen, refetch]);

  return (
    <BuyerReservationList reservations={reservations} onChange={refetch} />
  );
}
