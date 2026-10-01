import { useEffect, useState } from "react";
import { Heading, Stack, Text } from "@chakra-ui/react";

import ContactReveal from "@/features/listings/components/ContactReveal";
import ReserveButton from "@/features/listings/components/ReserveButton";
import SellerActions from "@/features/listings/components/SellerActions";
import StatusBadge from "../components/StatusBadge";
import { fetchListing } from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";
import { t } from "../i18n/t";
import {
  formatPrice,
  unitLabelKey,
} from "@/features/listings/utils/formatListing";

function useListing(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchListing(id).then(({ listing: row }) => {
      if (cancelled) return;
      setListing(row);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  const refetch = () => setReloadToken((token) => token + 1);

  return { listing, loading, refetch };
}

export default function ListingDetail({ id }: { id: string }) {
  const { listing, loading, refetch } = useListing(id);

  if (loading) return null;
  if (!listing) return <Text>{t("listing.notFound")}</Text>;

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
      <ReserveButton listing={listing} onChange={refetch} />
      {/* key={listing.status}: a successful reserve/cancel changes who RLS
          reveals the contact note to, but listing.id never changes — remount
          on status change to re-run the query instead of caching a stale
          "not visible yet" result. */}
      <ContactReveal key={listing.status} listingId={listing.id} />
      <SellerActions listing={listing} onChange={refetch} />
    </Stack>
  );
}
