import { Heading, Stack, Text } from "@chakra-ui/react";

import StatusBadge from "@/features/listings/components/StatusBadge";
import ContactReveal from "@/features/listings/components/ContactReveal";
import ReserveButton from "@/features/listings/components/ReserveButton";
import SellerActions from "@/features/listings/components/SellerActions";
import type { Listing } from "@/features/listings/types/listing";
import {
  formatPrice,
  unitLabelKey,
} from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

export type ListingDetailViewProps = {
  listing: Listing;
  onChange: () => void;
};

export default function ListingDetailView({
  listing,
  onChange,
}: ListingDetailViewProps) {
  return (
    <Stack gap="2">
      <Heading>{listing.location_label}</Heading>
      <Text>
        {t("listing.count.label")}: {listing.egg_count}{" "}
        {t(unitLabelKey(listing.unit))}
      </Text>
      <Text>
        {t("listing.price.label")}:{" "}
        {formatPrice(listing.price_cents, listing.currency)}
      </Text>
      <Text>
        {t("listing.status.label")}: <StatusBadge status={listing.status} />
      </Text>
      <ReserveButton listing={listing} onChange={onChange} />
      {/* key={listing.status}: a successful reserve/cancel changes who RLS
          reveals the contact note to, but listing.id never changes — remount
          on status change to re-run the query instead of caching a stale
          "not visible yet" result. */}
      <ContactReveal key={listing.status} listingId={listing.id} />
      <SellerActions listing={listing} onChange={onChange} />
    </Stack>
  );
}
