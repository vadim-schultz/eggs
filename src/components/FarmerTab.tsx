import { Button, Stack, Text } from "@chakra-ui/react";

import AuthButton from "../auth/AuthButton";
import { useSession } from "../auth/useSession";
import { t } from "../i18n/t";
import { useAppDialog } from "./AppDialogState";

function AddListingTrigger({
  signedIn,
  onAddListing,
}: {
  signedIn: boolean;
  onAddListing: () => void;
}) {
  if (signedIn) {
    return <Button onClick={onAddListing}>{t("nav.postListing")}</Button>;
  }
  return <Text>{t("auth.signInRequired")}</Text>;
}

export default function FarmerTab() {
  const { session } = useSession();
  const { openPostDialog } = useAppDialog();

  return (
    <Stack gap="4">
      <AuthButton />
      <AddListingTrigger
        signedIn={Boolean(session)}
        onAddListing={openPostDialog}
      />
    </Stack>
  );
}
