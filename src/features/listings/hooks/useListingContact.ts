import { useEffect, useState } from "react";

import { fetchListingContact } from "@/features/listings/services/listingsApi";

export function useListingContact(listingId: string) {
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
