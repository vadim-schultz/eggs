import { useEffect, useRef, useState } from "react";

export function useSupabaseQuery<T>(
  key: unknown[],
  fetcher: () => Promise<T>,
  options?: { initialData?: T },
): { data: T | null; loading: boolean; error: boolean; refetch: () => void } {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const queryKey = JSON.stringify(key);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.resolve()
      .then(() => fetcherRef.current())
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryKey, reloadToken]);

  const refetch = () => setReloadToken((token) => token + 1);

  return { data, loading, error, refetch };
}
