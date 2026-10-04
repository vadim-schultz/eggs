import { describe, expect, it, vi } from "vitest";

import { fetchListingReservations } from "./listingsApi";

const { orderMock, eqMock, selectMock, fromMock } = vi.hoisted(() => {
  const orderMock = vi.fn();
  const eqMock = vi.fn(() => ({ order: orderMock }));
  const selectMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  return { orderMock, eqMock, selectMock, fromMock };
});

vi.mock("@/lib/supabaseClient", () => ({ supabase: { from: fromMock } }));

describe("fetchListingReservations", () => {
  it("selects the listing's reservations newest first", async () => {
    const rows = [
      { id: "r1", egg_count: 6, status: "active", created_at: "x" },
    ];
    orderMock.mockResolvedValue({ data: rows, error: null });

    const result = await fetchListingReservations("listing-1");

    expect(fromMock).toHaveBeenCalledWith("reservation");
    expect(selectMock).toHaveBeenCalledWith(
      "id, egg_count, status, created_at",
    );
    expect(eqMock).toHaveBeenCalledWith("listing_id", "listing-1");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result.reservations).toEqual(rows);
  });

  it("returns an empty list when the query yields nothing", async () => {
    orderMock.mockResolvedValue({ data: null, error: { message: "x" } });

    const result = await fetchListingReservations("listing-1");

    expect(result.reservations).toEqual([]);
  });
});
