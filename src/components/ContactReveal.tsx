import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

import { t } from "../i18n/t";
import { supabase } from "../lib/supabaseClient";

interface ListingContact {
  contact_note: string;
}

function useListingContact(listingId: string) {
  const [contact, setContact] = useState<ListingContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("listing_contact")
      .select("contact_note")
      .eq("listing_id", listingId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setContact((data as ListingContact | null) ?? null);
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
