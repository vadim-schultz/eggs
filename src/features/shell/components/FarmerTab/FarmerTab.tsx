import { Stack, Text } from "@chakra-ui/react";

import AuthButton from "@/features/auth/components/AuthButton";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAppDialog } from "@/features/shell/context/appDialog";
import { t } from "@/i18n/t";

import AddListingTrigger from "./AddListingTrigger";

export default function FarmerTab() {
  const { session } = useSession();
  const { openPostDialog } = useAppDialog();

  return (
    <Stack gap="4">
      <AuthButton />
      {session ? (
        <AddListingTrigger onAddListing={openPostDialog} />
      ) : (
        <Text>{t("auth.signInRequired")}</Text>
      )}
    </Stack>
  );
}
