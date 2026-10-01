import { Text } from "@chakra-ui/react";

import { ListingDetailView } from "@/features/listings/components/ListingDetail";
import { useListing } from "@/features/listings/hooks/useListing";
import { t } from "@/i18n/t";

export default function ListingDetail({ id }: { id: string }) {
  const { listing, loading, refetch } = useListing(id);

  if (loading) return null;
  if (!listing) return <Text>{t("listing.notFound")}</Text>;

  return <ListingDetailView listing={listing} onChange={refetch} />;
}
