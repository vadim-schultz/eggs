import { Text } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import { useListing } from "@/features/listings/hooks/useListing";
import { t } from "@/i18n/t";

import BuyerListingDialog from "./BuyerListingDialog";
import SellerListingDialog from "./SellerListingDialog";

export default function ListingDetail({ id }: { id: string }) {
  const { listing, loading, refetch } = useListing(id);
  const { session } = useSession();

  if (loading) return null;
  if (!listing) return <Text>{t("listing.notFound")}</Text>;

  if (session?.user.id === listing.seller_id) {
    return <SellerListingDialog listing={listing} />;
  }
  return <BuyerListingDialog listing={listing} onChange={refetch} />;
}
