import { useState } from "react";
import { Button, HStack, Input, Stack, Text } from "@chakra-ui/react";

import { useSession } from "@/features/auth/hooks/useSession";
import {
  markListingCancelled,
  markListingSold,
  updateListingExpiry,
} from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";
import { t } from "../i18n/t";

const MAX_EXPIRY_DAYS = 14;

function maxExpiryDate(): Date {
  return new Date(Date.now() + MAX_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

interface SellerActionsProps {
  listing: Listing;
  onChange: () => void;
}

function MarkStatusActions({ listing, onChange }: SellerActionsProps) {
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

function ExpiryEditor({ listing, onChange }: SellerActionsProps) {
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

export default function SellerActions({
  listing,
  onChange,
}: SellerActionsProps) {
  const { session } = useSession();
  const isOwner = session?.user.id === listing.seller_id;

  if (!isOwner) return null;

  return (
    <Stack gap="3" borderWidth="1px" borderRadius="md" p="3">
      <MarkStatusActions listing={listing} onChange={onChange} />
      <ExpiryEditor listing={listing} onChange={onChange} />
    </Stack>
  );
}
