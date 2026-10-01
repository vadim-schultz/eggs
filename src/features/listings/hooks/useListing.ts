import { fetchListing } from "@/features/listings/services/listingsApi";
import { useSupabaseQuery } from "@/lib/async/useSupabaseQuery";

export function useListing(id: string) {
  const { data, loading, refetch } = useSupabaseQuery([id], () =>
    fetchListing(id).then(({ listing }) => listing),
  );
  const awaitingFirstResult = loading && data === null;

  return { listing: data, loading: awaitingFirstResult, refetch };
}
