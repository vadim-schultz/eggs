import { useEffect, useState } from "react";

import { searchPlace } from "@/features/location/services/geocodeApi";
import type { PlaceCandidate } from "@/features/location/types/place";

const SEARCH_DEBOUNCE_MS = 500;

/** Debounced Nominatim search for the current query string. */
export function useSearchCandidates(query: string) {
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setCandidates([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      searchPlace(query).then((results) => {
        setCandidates(results);
        setSearching(false);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return { candidates, searching };
}
