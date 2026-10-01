import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Listing } from "@/features/listings/types/listing";
import { fetchListing, fetchListingContact } from "./listingsApi";

const { singleMock, maybeSingleMock, eqMock, selectMock, fromMock } =
  vi.hoisted(() => {
    const singleMock = vi.fn();
    const maybeSingleMock = vi.fn();
    const eqMock = vi.fn((...args: unknown[]) => {
      if (args[0] === "listing_id") {
        return { maybeSingle: maybeSingleMock };
      }
      return { single: singleMock };
    });
    const selectMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ select: selectMock }));
    return { singleMock, maybeSingleMock, eqMock, selectMock, fromMock };
  });

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_cents: 400,
    currency: "EUR",
    location_label: "Downtown",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

describe("listingsApi", () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    singleMock.mockReset();
    maybeSingleMock.mockReset();
  });

  it("fetchListing returns row when supabase resolves data", async () => {
    const row = activeListing();
    singleMock.mockResolvedValue({ data: row, error: null });

    const result = await fetchListing("listing-1");

    expect(fromMock).toHaveBeenCalledWith("listing");
    expect(eqMock).toHaveBeenCalledWith("id", "listing-1");
    expect(result).toEqual({ listing: row });
  });

  it("fetchListing returns null when supabase returns no row", async () => {
    singleMock.mockResolvedValue({ data: null, error: null });

    const result = await fetchListing("missing");

    expect(result).toEqual({ listing: null });
  });

  it("fetchListingContact returns contact when a row exists", async () => {
    maybeSingleMock.mockResolvedValue({
      data: { contact_note: "Ring the bell" },
      error: null,
    });

    const result = await fetchListingContact("listing-1");

    expect(fromMock).toHaveBeenCalledWith("listing_contact");
    expect(eqMock).toHaveBeenCalledWith("listing_id", "listing-1");
    expect(result).toEqual({ contact: { contact_note: "Ring the bell" } });
  });

  it("fetchListingContact returns null when no row exists", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    const result = await fetchListingContact("listing-1");

    expect(result).toEqual({ contact: null });
  });
});
