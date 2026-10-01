import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchListingsNear } from "./browseApi";

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { rpc: rpcMock },
}));

const center = { lat: 52.52, lng: 13.405 };

describe("browseApi", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("calls listings_near with the given center and radius", async () => {
    const listings = [{ id: "listing-1" }];
    rpcMock.mockResolvedValue({ data: listings, error: null });

    const result = await fetchListingsNear(center, 15000);

    expect(rpcMock).toHaveBeenCalledWith("listings_near", {
      p_lat: 52.52,
      p_lng: 13.405,
      p_radius_m: 15000,
    });
    expect(result).toEqual({ listings });
  });

  it("returns error when the RPC fails and drops the payload", async () => {
    rpcMock.mockResolvedValue({
      data: [{ id: "stale-success" }],
      error: { message: "fail" },
    });

    const result = await fetchListingsNear(center, 15000);

    expect(result).toEqual({ error: true });
  });
});
