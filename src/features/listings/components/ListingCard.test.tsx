import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Listing } from "@/features/listings/types/listing";

import ListingCard from "./ListingCard";

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 7,
    unit: "each",
    price_per_egg_cents: 400,
    currency: "EUR",
    location_label: "Downtown, near the market",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderCard(listing: Listing, selected = false) {
  const onSelect = vi.fn();
  render(
    <ChakraProvider value={defaultSystem}>
      <ListingCard listing={listing} selected={selected} onSelect={onSelect} />
    </ChakraProvider>,
  );
  return { onSelect };
}

describe("ListingCard", () => {
  it("shows EggQuantityRow and numeric available count matching egg_count", () => {
    const listing = activeListing({ egg_count: 7 });
    renderCard(listing);

    expect(screen.getByTestId("egg-quantity-row")).toBeInTheDocument();
    expect(screen.getAllByTestId("egg-quantity-outline")).toHaveLength(7);

    const rows = screen.getAllByTestId("key-value-row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Anzahl")).toBeInTheDocument();
    expect(screen.getByText("7 Stück")).toBeInTheDocument();
    expect(screen.getByText("Preis pro Ei")).toBeInTheDocument();
    expect(screen.getByText(/4,00\s?€/)).toBeInTheDocument();
  });

  it("does not render status label or StatusBadge copy", () => {
    renderCard(activeListing());

    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryByText("Verfügbar")).not.toBeInTheDocument();
  });

  it("does not render the listing place name as a heading", () => {
    renderCard(activeListing());

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Downtown, near the market"),
    ).not.toBeInTheDocument();
  });
});
