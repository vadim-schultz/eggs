import { Stack, Text } from "@chakra-ui/react";

import SellerReservationList from "@/features/listings/components/SellerReservationList";
import { useSellerReservations } from "@/features/listings/hooks/useSellerReservations";
import AuthButton from "@/features/auth/components/AuthButton";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAppDialog } from "@/features/shell/context/appDialog";
import { t } from "@/i18n/t";

import AddListingTrigger from "./AddListingTrigger";

function SellerReservations({ sellerId }: { sellerId: string }) {
  const { reservations } = useSellerReservations(sellerId);
  return <SellerReservationList reservations={reservations} />;
}

export default function FarmerTab() {
  const { session } = useSession();
  const { openPostDialog } = useAppDialog();

  return (
    <Stack gap="4">
      <AuthButton />
      {session ? (
        <>
          <AddListingTrigger onAddListing={openPostDialog} />
          <SellerReservations sellerId={session.user.id} />
        </>
      ) : (
        <Text>{t("auth.signInRequired")}</Text>
      )}
    </Stack>
  );
}
