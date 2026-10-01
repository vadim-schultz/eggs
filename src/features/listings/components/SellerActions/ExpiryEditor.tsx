import { useState } from "react";
import { Button, HStack, Input, Stack, Text } from "@chakra-ui/react";

import { updateListingExpiry } from "@/features/listings/services/listingsApi";
import { t } from "@/i18n/t";

import type { SellerActionsProps } from "./SellerActions";

const MAX_EXPIRY_DAYS = 14;

function maxExpiryDate(): Date {
  return new Date(Date.now() + MAX_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

/** Expiry date field and save action for listing owners. */

export default function ExpiryEditor({
  listing,
  onChange,
}: SellerActionsProps) {
  const [value, setValue] = useState(listing.expires_at.slice(0, 10));
  const [error, setError] = useState<"bound" | "rpc" | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    const next = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(next.getTime()) || next > maxExpiryDate()) {
      setError("bound");
      return;
    }

    setBusy(true);
    setError(null);
    const result = await updateListingExpiry(listing.id, next.toISOString());
    setBusy(false);
    if (result.error) {
      setError("rpc");
      return;
    }
    onChange();
  }

  return (
    <Stack gap="1">
      <Text>{t("seller.expiresAt.label")}</Text>
      <HStack gap="2">
        <Input
          type="date"
          value={value}
          max={maxExpiryDate().toISOString().slice(0, 10)}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button disabled={busy} onClick={save}>
          {t("seller.expiresAt.save")}
        </Button>
      </HStack>
      {error === "bound" && (
        <Text color="fg.error">{t("seller.expiresAt.error")}</Text>
      )}
      {error === "rpc" && <Text color="fg.error">{t("seller.error")}</Text>}
    </Stack>
  );
}
