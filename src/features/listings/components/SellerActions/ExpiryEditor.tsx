import { useState } from "react";
import { Button, Field, HStack, Input } from "@chakra-ui/react";

import { updateListingExpiry } from "@/features/listings/services/listingsApi";
import { t } from "@/i18n/t";
import { useAsyncAction } from "@/lib/async/useAsyncAction";

import type { SellerActionsProps } from "./SellerActions";

const MAX_EXPIRY_DAYS = 14;

type ExpiryFieldError = "bound" | "rpc";

function maxExpiryDate(): Date {
  return new Date(Date.now() + MAX_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

function expiryFieldError(
  boundError: boolean,
  rpcError: boolean,
): ExpiryFieldError | null {
  if (boundError) return "bound";
  if (rpcError) return "rpc";
  return null;
}

/** Expiry date field and save action for listing owners. */

export default function ExpiryEditor({
  listing,
  onChange,
}: SellerActionsProps) {
  const [value, setValue] = useState(listing.expires_at.slice(0, 10));
  const [boundError, setBoundError] = useState(false);
  const { busy, error: rpcError, run, resetError } = useAsyncAction();
  const error = expiryFieldError(boundError, rpcError);

  async function save() {
    const next = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(next.getTime()) || next > maxExpiryDate()) {
      setBoundError(true);
      resetError();
      return;
    }

    setBoundError(false);
    await run(async () => {
      const result = await updateListingExpiry(listing.id, next.toISOString());
      if (result.error) return { ok: false };
      onChange();
      return { ok: true };
    });
  }

  return (
    <Field.Root invalid={error !== null}>
      <Field.Label>{t("seller.expiresAt.label")}</Field.Label>
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
        <Field.ErrorText>{t("seller.expiresAt.error")}</Field.ErrorText>
      )}
      {error === "rpc" && (
        <Field.ErrorText>{t("seller.error")}</Field.ErrorText>
      )}
    </Field.Root>
  );
}
