import type { ComponentProps } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import MapView from "./MapView";

const { useSessionMock, maybeSingleMock } = vi.hoisted(() => {
  const maybeSingleMock = vi.fn();
  return {
    useSessionMock: vi.fn(),
    maybeSingleMock,
  };
});

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));
import { easterColors } from "@/theme/tokens/colors";
import mapViewSource from "./MapView.tsx?raw";
import type { ListingNear } from "@/features/listings/types/listing";

function listing(overrides: Partial<ListingNear> = {}): ListingNear {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_per_egg_cents: 400,
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
  beforeEach(() => {
    useSessionMock.mockReset();
    useSessionMock.mockReturnValue({ session: null, loading: false });
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
  });

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

  it("calls onSelect when a marker is clicked and renders no popup or card", async () => {
    const onSelect = vi.fn();
    renderMap({
      listings: [listing({ id: "listing-pop" })],
      selectedId: "listing-pop",
      onSelect,
    });

    const markers = screen.getAllByTitle("Egg listing");
    fireEvent.click(markers[0]!.closest(".leaflet-marker-icon") ?? markers[0]!);

    expect(onSelect).toHaveBeenCalledWith("listing-pop");
    await waitFor(() => {
      expect(document.querySelector(".leaflet-popup")).toBeNull();
    });
    expect(screen.queryByTestId("listing-marker-popover")).toBeNull();
    expect(document.querySelector('[data-scope="card"]')).toBeNull();
  });

  it("colours marker pins from the egg palette, not hardcoded blue/orange", () => {
    renderMap({ listings: [listing()] });

    const pins = document.querySelectorAll<HTMLElement>(".map-pin-marker span");
    const backgrounds = Array.from(pins).map((pin) => pin.style.background);
    const probe = document.createElement("span");
    probe.style.background = easterColors.coral[500].value;
    expect(backgrounds).toContain(probe.style.background);
    expect(mapViewSource).not.toMatch(/#2b6cb0|#dd6b20/i);
  });
});
