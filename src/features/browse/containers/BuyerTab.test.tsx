import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import {
  BackgroundMapProvider,
  useBackgroundMapState,
} from "@/features/shell/context/backgroundMap";
import type { ListingNear } from "@/features/listings/types/listing";

import BuyerTab from "./BuyerTab";

const {
  useSessionMock,
  useGeolocationMock,
  useListingsNearMock,
  useAppDialogMock,
} = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  useGeolocationMock: vi.fn(),
  useListingsNearMock: vi.fn(),
  useAppDialogMock: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("@/features/location/hooks/useGeolocation", () => ({
  useGeolocation: useGeolocationMock,
}));
vi.mock("@/features/browse/hooks/useListingsNear", () => ({
  useListingsNear: useListingsNearMock,
}));
vi.mock("@/features/shell/context/appDialog", () => ({
  useAppDialog: useAppDialogMock,
}));

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

function renderBuyerTab() {
  render(
    <ChakraProvider value={defaultSystem}>
      <BackgroundMapProvider>
        <BuyerTab />
      </BackgroundMapProvider>
    </ChakraProvider>,
  );
}

describe("BuyerTab", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    useGeolocationMock.mockReset();
    useListingsNearMock.mockReset();
    useAppDialogMock.mockReset();
    useSessionMock.mockReturnValue({ session: null, loading: false });
    useGeolocationMock.mockReturnValue({
      center: { lat: 52.52, lng: 13.405 },
      loading: false,
      geoGranted: true,
      requestLocation: vi.fn(),
    });
    useAppDialogMock.mockReturnValue({
      open: null,
      openPostDialog: vi.fn(),
      openDetailDialog: vi.fn(),
      closeDialog: vi.fn(),
    });
  });

  it("renders the Umkreis control with default radius 5 km", () => {
    useListingsNearMock.mockReturnValue({
      listings: [],
      loading: false,
      error: false,
    });

    renderBuyerTab();

    expect(screen.getByText("Umkreis")).toBeInTheDocument();
    expect(
      document.querySelector('[data-scope="slider"][data-part="root"]'),
    ).toBeInTheDocument();
    expect(screen.getByText("5 km")).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Umkreis" })).toBeNull();
  });

  it("does not render listing cards or ResultsGrid in the panel", () => {
    useListingsNearMock.mockReturnValue({
      listings: [listing({ id: "listing-1" }), listing({ id: "listing-2" })],
      loading: false,
      error: false,
    });

    renderBuyerTab();

    expect(screen.queryByTestId("results-grid")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /4,00/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Keine Angebote in diesem Umkreis gefunden/),
    ).not.toBeInTheDocument();
  });

  it("renders the location picker and auth control", () => {
    useListingsNearMock.mockReturnValue({
      listings: [],
      loading: false,
      error: false,
    });

    renderBuyerTab();

    expect(screen.getByText("Ort")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mit Google anmelden" }),
    ).toBeInTheDocument();
  });

  it("does not open the detail AppDialog when a map listing is selected", () => {
    const openDetailDialog = vi.fn();
    useAppDialogMock.mockReturnValue({
      open: null,
      openPostDialog: vi.fn(),
      openDetailDialog,
      closeDialog: vi.fn(),
    });
    useListingsNearMock.mockReturnValue({
      listings: [listing({ id: "listing-map-1" })],
      loading: false,
      error: false,
    });

    function MapSelectTrigger() {
      const { onSelect } = useBackgroundMapState();
      return (
        <button type="button" onClick={() => onSelect("listing-map-1")}>
          trigger-map-select
        </button>
      );
    }

    render(
      <ChakraProvider value={defaultSystem}>
        <BackgroundMapProvider>
          <BuyerTab />
          <MapSelectTrigger />
        </BackgroundMapProvider>
      </ChakraProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "trigger-map-select" }));

    expect(openDetailDialog).not.toHaveBeenCalled();
  });

  it("does not render the searchInstead copy", () => {
    useListingsNearMock.mockReturnValue({
      listings: [],
      loading: false,
      error: false,
    });

    renderBuyerTab();

    expect(
      screen.queryByText("Oder einen anderen Ort suchen"),
    ).not.toBeInTheDocument();
  });
});
