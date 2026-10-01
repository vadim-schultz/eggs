import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import ListingDetail from "./ListingDetail";
import type { Listing } from "@/features/listings/types/listing";

const { singleMock, eqMock, selectMock, fromMock } = vi.hoisted(() => {
  const singleMock = vi.fn();
  const eqMock = vi.fn(() => ({ single: singleMock }));
  const selectMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  return { singleMock, eqMock, selectMock, fromMock };
});

vi.mock("../lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

vi.mock("../components/ReserveButton", () => ({
  default: () => <div data-testid="reserve-button" />,
}));

vi.mock("../components/ContactReveal", () => ({
  default: ({ listingId }: { listingId: string }) => (
    <div data-testid="contact-reveal">{listingId}</div>
  ),
}));

vi.mock("../components/SellerActions", () => ({
  default: () => <div data-testid="seller-actions" />,
}));

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_cents: 400,
    currency: "EUR",
    location_label: "Downtown, near the market",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderAt(id: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <ListingDetail id={id} />
    </ChakraProvider>,
  );
}

describe("ListingDetail", () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    singleMock.mockReset();
  });

  it("renders count, unit, price and location_label for an active listing", async () => {
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");

    expect(
      await screen.findByText("Downtown, near the market"),
    ).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
    expect(screen.getByText(/4,00\s?€/)).toBeInTheDocument();
    expect(fromMock).toHaveBeenCalledWith("listing");
    expect(eqMock).toHaveBeenCalledWith("id", "listing-1");
  });

  it("mounts ReserveButton and the contact reveal for the loaded listing", async () => {
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");
    await screen.findByText("Downtown, near the market");

    expect(screen.getByTestId("reserve-button")).toBeInTheDocument();
    expect(screen.getByTestId("contact-reveal")).toHaveTextContent("listing-1");
    expect(screen.getByTestId("seller-actions")).toBeInTheDocument();
  });

  it("seller sees the contact reveal for their own listing regardless of reservation", async () => {
    singleMock.mockResolvedValue({
      data: activeListing({ seller_id: "seller-1", status: "reserved" }),
      error: null,
    });

    renderAt("listing-1");
    await screen.findByText("Downtown, near the market");

    expect(screen.getByTestId("contact-reveal")).toHaveTextContent("listing-1");
  });

  it("shows the not-found message when the listing can't be loaded", async () => {
    singleMock.mockResolvedValue({ data: null, error: null });

    renderAt("missing-listing");

    expect(
      await screen.findByText("Angebot nicht gefunden."),
    ).toBeInTheDocument();
  });
});
