import { Button, HStack, Stack, Text } from "@chakra-ui/react";

import {
  markListingCancelled,
  markListingSold,
} from "@/features/listings/services/listingsApi";
import { t } from "@/i18n/t";
import { useAsyncAction } from "@/lib/async/useAsyncAction";

import type { SellerActionsProps } from "./SellerActions";

/** Sold and cancelled controls for active or reserved listings. */

export default function MarkStatusActions({
  listing,
  onChange,
}: SellerActionsProps) {
  const { busy, error, run } = useAsyncAction();

  if (listing.status !== "active" && listing.status !== "reserved") {
    return null;
  }

  async function persist(action: () => Promise<{ error?: true }>) {
    await run(async () => {
      const result = await action();
      if (result.error) return { ok: false };
      onChange();
      return { ok: true };
    });
  }

  return (
    <Stack gap="1">
      <HStack gap="2">
        <Button
          disabled={busy}
          onClick={() => persist(() => markListingSold(listing.id))}
        >
          {t("seller.markSold")}
        </Button>
        <Button
          disabled={busy}
          onClick={() => persist(() => markListingCancelled(listing.id))}
        >
          {t("seller.markCancelled")}
        </Button>
      </HStack>
      {error && <Text color="fg.error">{t("seller.error")}</Text>}
    </Stack>
  );
}
