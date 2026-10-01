import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

import { fetchListingContact } from "@/features/listings/services/listingsApi";
import { t } from "../i18n/t";

function useListingContact(listingId: string) {
  const [contact, setContact] = useState<{ contact_note: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchListingContact(listingId).then(({ contact: row }) => {
      if (cancelled) return;
      setContact(row);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  return { contact, loading };
}

export default function ContactReveal({ listingId }: { listingId: string }) {
  const { contact, loading } = useListingContact(listingId);

  if (loading || !contact) return null;

  return (
    <Text>
      {t("reserve.contactNote.label")}: {contact.contact_note}
    </Text>
  );
}
