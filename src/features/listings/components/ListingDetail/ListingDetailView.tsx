import { Stack, Text } from "@chakra-ui/react";

import BrailleQuantityRow from "@/components/ui/BrailleQuantityRow";
import KeyValueRow from "@/components/ui/KeyValueRow";
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
  const amountLabel = `${listing.egg_count} ${t(unitLabelKey(listing.unit))}`;
  const priceLabel = formatPrice(listing.price_cents, listing.currency);

  return (
    <Stack gap="2">
      <BrailleQuantityRow eggCount={listing.egg_count} unit={listing.unit} />
      <KeyValueRow label={t("listing.count.label")}>
        <Text fontSize="sm">{amountLabel}</Text>
      </KeyValueRow>
      <KeyValueRow label={t("listing.price.label")}>
        <Text fontSize="sm">{priceLabel}</Text>
      </KeyValueRow>
      <KeyValueRow label={t("listing.status.label")}>
        <StatusBadge status={listing.status} />
      </KeyValueRow>
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
