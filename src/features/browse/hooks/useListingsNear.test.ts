import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useListingsNear } from "./useListingsNear";

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { rpc: rpcMock },
}));

describe("useListingsNear", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ data: [], error: null });
  });

  it("calls the listings_near RPC with the given center and radius", async () => {
    renderHook(() => useListingsNear({ lat: 52.52, lng: 13.405 }, 15000));

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("listings_near", {
        p_lat: 52.52,
        p_lng: 13.405,
        p_radius_m: 15000,
      }),
    );
  });

  it("exposes loading then the resolved listings", async () => {
    const listings = [{ id: "listing-1" }];
    rpcMock.mockResolvedValue({ data: listings, error: null });

    const { result } = renderHook(() =>
      useListingsNear({ lat: 52.52, lng: 13.405 }, 15000),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.listings).toEqual(listings);
    expect(result.current.error).toBe(false);
  });

  it("sets error when RPC fails", async () => {
    rpcMock.mockResolvedValue({
      data: [{ id: "stale-success" }],
      error: { message: "fail" },
    });

    const { result } = renderHook(() =>
      useListingsNear({ lat: 52.52, lng: 13.405 }, 15000),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.listings).toEqual([]);
  });
});
