import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import SellerActions from "./SellerActions";
import type { Listing } from "@/features/listings/types/listing";

const { useSessionMock, rpcMock, eqMock, updateMock, fromMock } = vi.hoisted(
  () => {
    const eqMock = vi.fn(() => Promise.resolve({ error: null }));
    const updateMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ update: updateMock }));
    return {
      useSessionMock: vi.fn(),
      rpcMock: vi.fn(),
      eqMock,
      updateMock,
      fromMock,
    };
  },
);

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("../lib/supabaseClient", () => ({
  supabase: { from: fromMock, rpc: rpcMock },
}));

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_cents: 400,
    currency: "EUR",
    location_label: "Downtown",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderActions(listing: Listing, onChange = vi.fn()) {
  render(
    <ChakraProvider value={defaultSystem}>
      <SellerActions listing={listing} onChange={onChange} />
    </ChakraProvider>,
  );
  return onChange;
}

describe("SellerActions", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    rpcMock.mockReset();
    fromMock.mockClear();
    updateMock.mockClear();
    eqMock.mockClear();
    eqMock.mockResolvedValue({ error: null });
  });

  it("is not rendered for a non-owner", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "stranger-1" } },
      loading: false,
    });

    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <SellerActions listing={activeListing()} onChange={vi.fn()} />
      </ChakraProvider>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("mark sold calls mark_listing_sold and updates the shown status", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });

    const onChange = renderActions(activeListing());

    fireEvent.click(
      screen.getByRole("button", { name: "Als verkauft markieren" }),
    );

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("mark_listing_sold", {
        p_listing_id: "listing-1",
      }),
    );
    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("mark cancelled calls mark_listing_cancelled and updates the shown status", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });

    const onChange = renderActions(activeListing());

    fireEvent.click(
      screen.getByRole("button", { name: "Angebot zurückziehen" }),
    );

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("mark_listing_cancelled", {
        p_listing_id: "listing-1",
      }),
    );
    await waitFor(() => expect(onChange).toHaveBeenCalled());
  });

  it("expires_at editor rejects a date beyond the allowed bound", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });

    renderActions(activeListing());

    const farFuture = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    fireEvent.change(screen.getByDisplayValue("2026-01-04"), {
      target: { value: farFuture },
    });
    fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

    expect(
      await screen.findByText(
        "Das Datum darf höchstens 14 Tage in der Zukunft liegen.",
      ),
    ).toBeInTheDocument();
    expect(updateMock).not.toHaveBeenCalled();
  });
});
