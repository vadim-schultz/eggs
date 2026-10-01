import { useState } from "react";
import { Button, HStack, Stack, Text } from "@chakra-ui/react";

import {
  markListingCancelled,
  markListingSold,
} from "@/features/listings/services/listingsApi";
import { t } from "@/i18n/t";

import type { SellerActionsProps } from "./SellerActions";

/** Sold and cancelled controls for active or reserved listings. */

export default function MarkStatusActions({
  listing,
  onChange,
}: SellerActionsProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  if (listing.status !== "active" && listing.status !== "reserved") {
    return null;
  }

  async function markAs(kind: "sold" | "cancelled") {
    setBusy(true);
    setError(false);
    const result =
      kind === "sold"
        ? await markListingSold(listing.id)
        : await markListingCancelled(listing.id);
    setBusy(false);
    if (result.error) {
      setError(true);
      return;
    }
    onChange();
  }

  return (
    <Stack gap="1">
      <HStack gap="2">
        <Button disabled={busy} onClick={() => markAs("sold")}>
          {t("seller.markSold")}
        </Button>
        <Button disabled={busy} onClick={() => markAs("cancelled")}>
          {t("seller.markCancelled")}
        </Button>
      </HStack>
      {error && <Text color="fg.error">{t("seller.error")}</Text>}
    </Stack>
  );
}
