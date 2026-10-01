import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSupabaseQuery } from "./useSupabaseQuery";

describe("useSupabaseQuery", () => {
  it("resolves data and sets loading false after fetcher resolves", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: "egg-1" });

    const { result } = renderHook(() => useSupabaseQuery(["egg-1"], fetcher));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(false);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ id: "egg-1" });
    expect(result.current.error).toBe(false);
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("sets error true when fetcher rejects and clears loading", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useSupabaseQuery(["egg-1"], fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("does not update state when the fetcher resolves after unmount", async () => {
    let resolveFetcher: (value: { id: string }) => void = () => {};
    const fetcher = vi.fn(
      () =>
        new Promise<{ id: string }>((resolve) => {
          resolveFetcher = resolve;
        }),
    );

    const seen: Array<{ data: unknown; loading: boolean; error: boolean }> =
      [];
    const { unmount } = renderHook(() => {
      const state = useSupabaseQuery(["egg-1"], fetcher);
      seen.push({
        data: state.data,
        loading: state.loading,
        error: state.error,
      });
      return state;
    });

    expect(seen.at(-1)).toEqual({ data: null, loading: true, error: false });
    const rendersBeforeSettle = seen.length;
    unmount();

    await act(async () => {
      resolveFetcher({ id: "late" });
      await Promise.resolve();
    });

    expect(seen).toHaveLength(rendersBeforeSettle);
    expect(seen.at(-1)).toEqual({ data: null, loading: true, error: false });
  });
});
