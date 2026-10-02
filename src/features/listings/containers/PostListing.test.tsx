import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import PostListing from "./PostListing";

const { rpcMock, searchPlaceMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  searchPlaceMock: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { rpc: rpcMock },
}));

vi.mock("@/features/location/services/geocodeApi", () => ({
  searchPlace: searchPlaceMock,
}));

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

async function selectUnit(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

describe("PostListing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    rpcMock.mockReset();
    searchPlaceMock.mockReset();
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
      p_egg_count: 1,
      p_unit: "dozen",
      p_price_cents: 400,
      p_lat: 52.52,
      p_lng: 13.405,
      p_location_label: "Berlin, Germany",
      p_note: null,
      p_contact_note: "Ring the bell",
    });
    expect(onCreated).toHaveBeenCalledWith("listing-1");
  });

  it("unit field has no native <select> element", () => {
    const { container } = renderPostListing();

    expect(container.querySelectorAll("select")).toHaveLength(0);
  });

  it("does not render a Notiz field", () => {
    renderPostListing();

    expect(screen.queryByLabelText("Notiz (optional)")).not.toBeInTheDocument();
  });

  it("shows submit error when create_listing fails", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "fail" } });
    const onCreated = vi.fn();
    renderPostListing(onCreated);

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

    expect(
      screen.getByText(
        "Angebot konnte nicht veröffentlicht werden. Bitte versuche es erneut.",
      ),
    ).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("still submits the chosen unit value", async () => {
    rpcMock.mockResolvedValue({ data: { id: "listing-1" }, error: null });
    renderPostListing();

    fireEvent.change(screen.getByLabelText("Preis (€)"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByLabelText("Kontakthinweis für Käufer"), {
      target: { value: "Ring the bell" },
    });
    await selectUnit("Stück");
    await confirmLocation("Berlin");

    fireEvent.click(
      screen.getByRole("button", { name: "Angebot veröffentlichen" }),
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(rpcMock).toHaveBeenCalledWith(
      "create_listing",
      expect.objectContaining({ p_unit: "each" }),
    );
  });
});
