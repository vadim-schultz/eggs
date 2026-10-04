import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import PostListing from "./PostListing";

const { rpcMock, searchPlaceMock, reverseGeocodeMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  searchPlaceMock: vi.fn(),
  reverseGeocodeMock: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { rpc: rpcMock },
}));

vi.mock("@/features/location/services/geocodeApi", () => ({
  searchPlace: searchPlaceMock,
  reverseGeocode: reverseGeocodeMock,
}));

function stubGeolocation(position: { lat: number; lng: number } | null) {
  Object.defineProperty(globalThis.navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: (
        success: PositionCallback,
        failure: PositionErrorCallback,
      ) =>
        position
          ? success({
              coords: { latitude: position.lat, longitude: position.lng },
            } as GeolocationPosition)
          : failure({} as GeolocationPositionError),
    },
  });
}

function renderPostListing(onCreated = vi.fn()) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <PostListing onCreated={onCreated} />
    </ChakraProvider>,
  );
}

async function confirmLocation(query = "Berlin") {
  searchPlaceMock.mockResolvedValue([
    { label: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  ]);
  fireEvent.change(screen.getByPlaceholderText("Ort suchen …"), {
    target: { value: query },
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(searchPlaceMock).toHaveBeenCalledWith(query);
  fireEvent.click(screen.getByText("Berlin, Germany"));
}

describe("PostListing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    rpcMock.mockReset();
    searchPlaceMock.mockReset();
    reverseGeocodeMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(globalThis.navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });
  });

  it("disables submit until a location is confirmed", async () => {
    renderPostListing();

    expect(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    ).toBeDisabled();

    await confirmLocation();

    expect(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    ).toBeEnabled();
  });

  it("shows the field validation message from validateListingInput", async () => {
    renderPostListing();
    await confirmLocation();

    fireEvent.click(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(
      screen.getByText("Bitte gib einen Kontakthinweis an."),
    ).toHaveAttribute("data-part", "error-text");
    expect(
      screen.queryByText(
        "Angebot konnte nicht veröffentlicht werden. Bitte versuche es erneut.",
      ),
    ).not.toBeInTheDocument();
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('calls supabase.rpc("create_listing", ...) with the confirmed fields and opens the detail dialog for the new listing', async () => {
    rpcMock.mockResolvedValue({ data: { id: "listing-1" }, error: null });
    const onCreated = vi.fn();
    renderPostListing(onCreated);

    fireEvent.change(screen.getByLabelText("Preis pro Ei (€)"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Kontakthinweis für Käufer"), {
      target: { value: "Ring the bell" },
    });
    await confirmLocation("Berlin");

    fireEvent.click(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(rpcMock).toHaveBeenCalledWith("create_listing", {
      p_egg_count: 1,
      p_unit: "each",
      p_price_per_egg_cents: 400,
      p_lat: 52.52,
      p_lng: 13.405,
      p_location_label: "Berlin, Germany",
      p_note: null,
      p_contact_note: "Ring the bell",
    });
    expect(onCreated).toHaveBeenCalledWith("listing-1");
    expect(screen.getByTestId("egg-burst")).toBeInTheDocument();
  });

  it("renders price in KeyValueRow and Ort row like buyer search", () => {
    renderPostListing();

    const rows = screen.getAllByTestId("key-value-row");
    const priceRows = rows.filter((row) =>
      within(row).queryByText("Preis pro Ei"),
    );
    expect(priceRows).toHaveLength(1);
    expect(
      within(priceRows[0]).getByLabelText("Preis pro Ei (€)"),
    ).toBeInTheDocument();

    const ortRows = rows.filter((row) => within(row).queryByText("Ort"));
    expect(ortRows).toHaveLength(1);
    expect(
      within(ortRows[0]).getByPlaceholderText("Ort suchen …"),
    ).toBeInTheDocument();
  });

  it("does not render Stück/Dutzend unit chips on the post form", () => {
    renderPostListing();

    expect(screen.queryByTestId("unit-chip-row")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Stück" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Dutzend" }),
    ).not.toBeInTheDocument();
  });

  it("does not render a Notiz field", () => {
    renderPostListing();

    expect(screen.queryByLabelText("Notiz (optional)")).not.toBeInTheDocument();
  });

  it("shows submit error when create_listing fails", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "fail" } });
    const onCreated = vi.fn();
    renderPostListing(onCreated);

    fireEvent.change(screen.getByLabelText("Preis pro Ei (€)"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Kontakthinweis für Käufer"), {
      target: { value: "Ring the bell" },
    });
    await confirmLocation("Berlin");

    fireEvent.click(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(
      screen.getByText(
        "Angebot konnte nicht veröffentlicht werden. Bitte versuche es erneut.",
      ),
    ).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
    expect(screen.queryByTestId("egg-burst")).not.toBeInTheDocument();
  });

  it("fills the Ort field and enables submit via the locate button", async () => {
    stubGeolocation({ lat: 52.52, lng: 13.405 });
    reverseGeocodeMock.mockResolvedValue({
      label: "Berlin, Germany",
      lat: 52.52,
      lng: 13.405,
    });
    renderPostListing();

    fireEvent.click(
      screen.getByRole("button", { name: "Standort vom Browser" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByPlaceholderText("Ort suchen …")).toHaveValue(
      "Berlin, Germany",
    );
    expect(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    ).toBeEnabled();
  });

  it("leaves the form untouched when the browser position is denied", async () => {
    stubGeolocation(null);
    renderPostListing();

    fireEvent.click(
      screen.getByRole("button", { name: "Standort vom Browser" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByPlaceholderText("Ort suchen …")).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    ).toBeDisabled();
  });
});
