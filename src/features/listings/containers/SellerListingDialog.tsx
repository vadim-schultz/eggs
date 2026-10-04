import { Stack, Text } from "@chakra-ui/react";

import KeyValueRow from "@/components/ui/KeyValueRow";
import ContactReveal from "@/features/listings/components/ContactReveal";
import ListingSummary from "@/features/listings/components/ListingSummary";
import SellerReservationList from "@/features/listings/components/SellerReservationList";
import { useSellerReservations } from "@/features/listings/hooks/useSellerReservations";
import type { Listing } from "@/features/listings/types/listing";
import { formatDateTime } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

export type SellerListingDialogProps = {
  listing: Listing;
};

export default function SellerListingDialog({
  listing,
}: SellerListingDialogProps) {
  const { reservations: all } = useSellerReservations(listing.seller_id);
  const reservations = all.filter((r) => r.listing_id === listing.id);
  const reserved = reservations.reduce((sum, r) => sum + r.egg_count, 0);
  const eggs = (n: number) => `${n} ${t("listing.eggs.unit")}`;

  return (
    <Stack gap="2">
      <ListingSummary listing={listing} />
      <KeyValueRow label={t("sellerView.reserved.label")}>
        <Text fontSize="sm" data-testid="reserved-count">
          {eggs(reserved)}
        </Text>
      </KeyValueRow>
      <KeyValueRow label={t("sellerView.remaining.label")}>
        <Text fontSize="sm" data-testid="remaining-count">
          {eggs(listing.egg_count)}
        </Text>
      </KeyValueRow>
      <KeyValueRow label={t("sellerView.expires.label")}>
        <Text fontSize="sm">{formatDateTime(listing.expires_at)}</Text>
      </KeyValueRow>
      <ContactReveal listingId={listing.id} />
      <SellerReservationList reservations={reservations} showEmpty />
    </Stack>
  );
}
