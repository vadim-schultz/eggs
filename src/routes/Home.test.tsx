import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";

import Home from "./Home";
import type { Listing } from "../lib/listing";

const { useSessionMock, useGeolocationMock, useListingsNearMock } = vi.hoisted(
  () => ({
    useSessionMock: vi.fn(),
    useGeolocationMock: vi.fn(),
    useListingsNearMock: vi.fn(),
  }),
);

vi.mock("../auth/useSession", () => ({ useSession: useSessionMock }));
vi.mock("../hooks/useGeolocation", () => ({
  useGeolocation: useGeolocationMock,
}));
vi.mock("../hooks/useListingsNear", () => ({
  useListingsNear: useListingsNearMock,
}));
vi.mock("../components/MapView", () => ({
  default: ({ selectedId }: { selectedId: string | null }) => (
    <div data-testid="map-view">selected: {selectedId ?? "none"}</div>
  ),
}));

function listing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_cents: 400,
    currency: "EUR",
    location: { type: "Point", coordinates: [13.405, 52.52] },
    location_label: "Downtown",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderHome() {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("Home", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    useGeolocationMock.mockReset();
    useListingsNearMock.mockReset();
    useSessionMock.mockReturnValue({ session: null, loading: false });
    useGeolocationMock.mockReturnValue({
      center: { lat: 52.52, lng: 13.405 },
      loading: false,
    });
  });

  it("renders one ListingCard per returned listing", () => {
    useListingsNearMock.mockReturnValue({
      listings: [listing({ id: "listing-1" }), listing({ id: "listing-2" })],
      loading: false,
      error: false,
    });

    renderHome();

    expect(screen.getAllByRole("button", { name: /Downtown/ })).toHaveLength(2);
  });

  it("selecting a card highlights the matching marker", () => {
    useListingsNearMock.mockReturnValue({
      listings: [listing({ id: "listing-1" })],
      loading: false,
      error: false,
    });

    renderHome();

    fireEvent.click(screen.getByRole("button", { name: /Downtown/ }));

    expect(screen.getByTestId("map-view")).toHaveTextContent(
      "selected: listing-1",
    );
  });

  it("renders with no session at all", () => {
    useListingsNearMock.mockReturnValue({
      listings: [],
      loading: false,
      error: false,
    });

    renderHome();

    expect(
      screen.getByRole("heading", { name: "Eier in deiner Nähe" }),
    ).toBeInTheDocument();
  });
});
