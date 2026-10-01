import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveReservation } from "@/features/listings/hooks/useActiveReservation";

const { fetchActiveReservationMock } = vi.hoisted(() => ({
  fetchActiveReservationMock: vi.fn(),
}));

vi.mock("@/features/listings/services/listingsApi", () => ({
  fetchActiveReservation: fetchActiveReservationMock,
}));

describe("useActiveReservation", () => {
  beforeEach(() => {
    fetchActiveReservationMock.mockReset();
  });

  it("does not fetch when disabled", async () => {
    const { result } = renderHook(() =>
      useActiveReservation("listing-1", false),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reservation).toBeNull();
    expect(fetchActiveReservationMock).not.toHaveBeenCalled();
  });

  it("loads the active reservation when enabled", async () => {
    fetchActiveReservationMock.mockResolvedValue({
      reservation: { id: "res-1", buyer_id: "buyer-1" },
    });

    const { result } = renderHook(() =>
      useActiveReservation("listing-1", true),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchActiveReservationMock).toHaveBeenCalledWith("listing-1");
    expect(result.current.reservation).toEqual({
      id: "res-1",
      buyer_id: "buyer-1",
    });
  });
});
