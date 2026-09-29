import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading, Stack, Text } from "@chakra-ui/react";

import { t } from "../i18n/t";
import { supabase } from "../lib/supabaseClient";
import {
  formatPrice,
  statusLabelKey,
  unitLabelKey,
  type Listing,
} from "../lib/listing";

function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    supabase
      .from("listing")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (cancelled) return;
        setListing((data as Listing | null) ?? null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { listing, loading };
}

export default function ListingDetail() {
  const { id } = useParams();
  const { listing, loading } = useListing(id);

  if (loading) return null;
  if (!listing) return <Text>{t("listing.notFound")}</Text>;

  return (
    <Stack gap="2" p="4">
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
        {t("listing.status.label")}: {t(statusLabelKey(listing.status))}
      </Text>
    </Stack>
  );
}
