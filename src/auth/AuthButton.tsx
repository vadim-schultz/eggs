import { Button } from "@chakra-ui/react";

import { t } from "../i18n/t";
import { supabase } from "../lib/supabaseClient";
import { useSession } from "./useSession";

export default function AuthButton() {
  const { session } = useSession();

  if (!session) {
    return (
      <Button onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}>
        {t("auth.signIn")}
      </Button>
    );
  }

  return <Button onClick={() => supabase.auth.signOut()}>{t("auth.signOut")}</Button>;
}
