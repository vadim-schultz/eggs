import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useBuyerReservations } from "@/features/listings/hooks/useBuyerReservations";
import { useSellerReservations } from "@/features/listings/hooks/useSellerReservations";

const { sellerMock, buyerMock } = vi.hoisted(() => ({
  sellerMock: vi.fn(),
  buyerMock: vi.fn(),
}));

vi.mock("@/features/listings/services/reservationsApi", () => ({
  fetchSellerReservations: sellerMock,
  fetchBuyerReservations: buyerMock,
}));

describe.each([
  ["useSellerReservations", useSellerReservations, sellerMock],
  ["useBuyerReservations", useBuyerReservations, buyerMock],
])("%s", (_name, useHook, mock) => {
  beforeEach(() => mock.mockReset());

  it("is empty while loading, rows after resolve, refetch re-queries", async () => {
    const rows = [{ id: "r1" }];
    mock.mockResolvedValue({ reservations: rows });

    const { result } = renderHook(() => useHook("u1"));

    expect(result.current.reservations).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mock).toHaveBeenCalledWith("u1");
    expect(result.current.reservations).toEqual(rows);

    act(() => result.current.refetch());
    await waitFor(() => expect(mock).toHaveBeenCalledTimes(2));
  });
});
