import { useEffect, useState } from "react";

import { fetchListing } from "@/features/listings/services/listingsApi";
import type { Listing } from "@/features/listings/types/listing";

export function useListing(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchListing(id).then(({ listing: row }) => {
      if (cancelled) return;
      setListing(row);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  const refetch = () => setReloadToken((token) => token + 1);

  return { listing, loading, refetch };
}
