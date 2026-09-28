import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import PostListing from "./PostListing";

const { useSessionMock, rpcMock, searchPlaceMock, navigateMock } = vi.hoisted(
  () => ({
    useSessionMock: vi.fn(),
    rpcMock: vi.fn(),
    searchPlaceMock: vi.fn(),
    navigateMock: vi.fn(),
  }),
);

vi.mock("../auth/useSession", () => ({
  useSession: useSessionMock,
}));

vi.mock("../lib/supabaseClient", () => ({
  supabase: { rpc: rpcMock },
}));

vi.mock("../lib/geocode", () => ({
  searchPlace: searchPlaceMock,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderPostListing() {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter initialEntries={["/post"]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/post" element={<PostListing />} />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>,
  );
}

async function confirmLocation(query = "Berlin") {
  searchPlaceMock.mockResolvedValue([
    { label: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  ]);
  fireEvent.change(
    screen.getByLabelText("Ort (z. B. „Innenstadt, beim Markt“)"),
    { target: { value: query } },
  );
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  fireEvent.click(screen.getByRole("button", { name: "Berlin, Germany" }));
}

describe("PostListing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSessionMock.mockReset();
    rpcMock.mockReset();
    searchPlaceMock.mockReset();
    navigateMock.mockReset();
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
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

    expect(
      screen.getByText("Die Anzahl muss größer als 0 sein."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bitte gib einen Kontakthinweis an."),
    ).toBeInTheDocument();
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('calls supabase.rpc("create_listing", ...) with the confirmed fields and navigates to the new listing', async () => {
    rpcMock.mockResolvedValue({ data: { id: "listing-1" }, error: null });
    renderPostListing();

    fireEvent.change(screen.getByLabelText("Anzahl Eier"), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText("Preis (€)"), {
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
      p_egg_count: 12,
      p_unit: "dozen",
      p_price_cents: 400,
      p_lat: 52.52,
      p_lng: 13.405,
      p_location_label: "Berlin",
      p_note: null,
      p_contact_note: "Ring the bell",
    });
    expect(navigateMock).toHaveBeenCalledWith("/listings/listing-1");
  });

  it('redirects to "/" when rendered without a session', async () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderPostListing();

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
