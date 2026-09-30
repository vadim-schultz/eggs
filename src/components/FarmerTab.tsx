import { Button, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import AuthButton from "../auth/AuthButton";
import { useSession } from "../auth/useSession";
import { t } from "../i18n/t";

function AddListingTrigger({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    return (
      <Button asChild>
        <RouterLink to="/post">{t("nav.postListing")}</RouterLink>
      </Button>
    );
  }
  return <Text>{t("auth.signInRequired")}</Text>;
}

export default function FarmerTab() {
  const { session } = useSession();

  return (
    <Stack gap="4">
      <AuthButton />
      <AddListingTrigger signedIn={Boolean(session)} />
    </Stack>
  );
}
