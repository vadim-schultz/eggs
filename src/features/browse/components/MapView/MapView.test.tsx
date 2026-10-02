import type { ComponentProps } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import MapView from "./MapView";
import mapViewSource from "./MapView.tsx?raw";
import type { ListingNear } from "@/features/listings/types/listing";

function listing(overrides: Partial<ListingNear> = {}): ListingNear {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_cents: 400,
    currency: "EUR",
    lat: 52.52,
    lng: 13.405,
    location_label: "Downtown",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderMap(props: Partial<ComponentProps<typeof MapView>> = {}) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <MapView
        center={{ lat: 52.52, lng: 13.405 }}
        listings={[]}
        selectedId={null}
        onSelect={vi.fn()}
        {...props}
      />
    </ChakraProvider>,
  );
}

describe("MapView", () => {
  it("marks the user's location with a basket icon", () => {
    renderMap();

    expect(screen.getByTitle("Your location")).toBeInTheDocument();
  });

  it("marks each egg listing with an egg icon", () => {
    renderMap({
      listings: [
        listing({ id: "listing-1" }),
        listing({ id: "listing-2", lat: 52.53, lng: 13.41 }),
      ],
    });

    expect(screen.getAllByTitle("Egg listing")).toHaveLength(2);
  });

  it("uses no non-Tabler egg or basket icons", () => {
    expect(mapViewSource).not.toMatch(/FaEgg|RiShoppingBasket/);
    expect(mapViewSource).toContain('from "react-icons/tb"');
  });

  it("shows listing content in the popover layer when a marker is selected", async () => {
    const onSelect = vi.fn();
    const item = listing({
      id: "listing-pop",
      egg_count: 12,
      price_cents: 400,
    });
    const { unmount } = renderMap({
      listings: [item],
      selectedId: null,
      onSelect,
    });

    const markers = screen.getAllByTitle("Egg listing");
    fireEvent.click(markers[0]!.closest(".leaflet-marker-icon") ?? markers[0]!);
    expect(onSelect).toHaveBeenCalledWith("listing-pop");
    unmount();

    renderMap({
      listings: [item],
      selectedId: "listing-pop",
      onSelect,
    });

    await waitFor(() => {
      expect(screen.getByTestId("listing-marker-popover")).toBeInTheDocument();
    });
    expect(screen.getByText("Anzahl")).toBeInTheDocument();
    expect(screen.getByText(/4,00\s?€/)).toBeInTheDocument();
  });
});
