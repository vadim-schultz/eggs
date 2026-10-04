import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import ListingSummary from "./ListingSummary";
import type { Listing } from "@/features/listings/types/listing";

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
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

function renderSummary(l: Listing) {
  render(
    <ChakraProvider value={defaultSystem}>
      <ListingSummary listing={l} />
    </ChakraProvider>,
  );
}

describe("ListingSummary", () => {
  it("renders amount and price rows only", () => {
    renderSummary(listing());

    expect(screen.getAllByTestId("key-value-row")).toHaveLength(2);
    expect(screen.getByText("12 Eier")).toBeInTheDocument();
    expect(screen.getByText(/4,00\s?€/)).toBeInTheDocument();
  });

  it("renders no status, actions or location label", () => {
    renderSummary(listing({ status: "reserved" }));

    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryByText("Reserviert")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Downtown, near the market"),
    ).not.toBeInTheDocument();
  });
});
