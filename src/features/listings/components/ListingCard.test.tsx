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
  it("shows egg quantity row and KV labels for price and status", () => {
    const listing = activeListing();
    renderCard(listing);

    expect(screen.getByTestId("egg-quantity-row")).toBeInTheDocument();
    expect(screen.getAllByTestId("egg-quantity-outline")).toHaveLength(7);

    const rows = screen.getAllByTestId("key-value-row");
    expect(rows).toHaveLength(3);
    expect(screen.getByText("Anzahl")).toBeInTheDocument();
    expect(screen.getByText("Preis")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText(/4,00\s?€/)).toBeInTheDocument();
    expect(screen.getByText("Verfügbar")).toBeInTheDocument();
  });

  it("does not render the listing place name as a heading", () => {
    renderCard(activeListing());

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Downtown, near the market"),
    ).not.toBeInTheDocument();
  });
});
