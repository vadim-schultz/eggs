import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useListingReservations } from "@/features/listings/hooks/useListingReservations";

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));

vi.mock("@/features/listings/services/listingsApi", () => ({
  fetchListingReservations: fetchMock,
}));

describe("useListingReservations", () => {
  beforeEach(() => fetchMock.mockReset());

  it("loads reservations for the listing", async () => {
    const rows = [
      { id: "r1", egg_count: 6, status: "active", created_at: "x" },
    ];
    fetchMock.mockResolvedValue({ reservations: rows });

    const { result } = renderHook(() => useListingReservations("listing-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledWith("listing-1");
    expect(result.current.reservations).toEqual(rows);
  });

  it("defaults to an empty list while there is no data", async () => {
    fetchMock.mockResolvedValue({ reservations: [] });

    const { result } = renderHook(() => useListingReservations("listing-1"));

    expect(result.current.reservations).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reservations).toEqual([]);
  });
});
