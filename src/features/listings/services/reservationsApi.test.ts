import { describe, expect, it, vi } from "vitest";

import {
  fetchBuyerReservations,
  fetchSellerReservations,
} from "./reservationsApi";

const { chain, fromMock } = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const m of ["select", "eq", "gt"]) chain[m] = vi.fn(() => chain);
  chain.order = vi.fn();
  const fromMock = vi.fn(() => chain);
  return { chain, fromMock };
});

vi.mock("@/lib/supabaseClient", () => ({ supabase: { from: fromMock } }));

const embed = {
  id: "r1",
  egg_count: 6,
  created_at: "x",
  listing_id: "l1",
  listing: { location_label: "Hof", listing_contact: { contact_note: "Tor" } },
};

describe("fetchSellerReservations", () => {
  it("filters active, own, unexpired and maps rows", async () => {
    chain.order.mockResolvedValue({ data: [embed], error: null });

    const { reservations } = await fetchSellerReservations("s1");

    expect(fromMock).toHaveBeenCalledWith("reservation");
    expect(chain.eq).toHaveBeenCalledWith("status", "active");
    expect(chain.eq).toHaveBeenCalledWith("listing.seller_id", "s1");
    expect(chain.gt).toHaveBeenCalledWith(
      "listing.expires_at",
      expect.any(String),
    );
    expect(chain.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(reservations).toEqual([
      {
        id: "r1",
        egg_count: 6,
        created_at: "x",
        listing_id: "l1",
        location_label: "Hof",
      },
    ]);
  });

  it("returns [] on error or empty response", async () => {
    chain.order.mockResolvedValue({ data: null, error: { message: "x" } });
    expect((await fetchSellerReservations("s1")).reservations).toEqual([]);
  });
});

describe("fetchBuyerReservations", () => {
  it("filters by buyer and maps the contact note", async () => {
    chain.order.mockResolvedValue({ data: [embed], error: null });

    const { reservations } = await fetchBuyerReservations("b1");

    expect(chain.eq).toHaveBeenCalledWith("buyer_id", "b1");
    expect(reservations[0].contact_note).toBe("Tor");
  });

  it("keeps the row with a null note when contact is missing", async () => {
    chain.order.mockResolvedValue({
      data: [
        { ...embed, listing: { location_label: "Hof", listing_contact: null } },
      ],
      error: null,
    });
    const { reservations } = await fetchBuyerReservations("b1");
    expect(reservations).toHaveLength(1);
    expect(reservations[0].contact_note).toBeNull();
  });

  it("returns [] on error", async () => {
    chain.order.mockResolvedValue({ data: null, error: { message: "x" } });
    expect((await fetchBuyerReservations("b1")).reservations).toEqual([]);
  });
});
