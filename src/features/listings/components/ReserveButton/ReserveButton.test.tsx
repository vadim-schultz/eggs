import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import ReserveButton from "./ReserveButton";
import type { Listing } from "@/features/listings/types/listing";

const {
  useSessionMock,
  rpcMock,
  maybeSingleMock,
  eqStatusMock,
  eqListingIdMock,
  selectMock,
  fromMock,
} = vi.hoisted(() => {
  const maybeSingleMock = vi.fn();
  const eqStatusMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const eqListingIdMock = vi.fn(() => ({ eq: eqStatusMock }));
  const selectMock = vi.fn(() => ({ eq: eqListingIdMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  return {
    useSessionMock: vi.fn(),
    rpcMock: vi.fn(),
    maybeSingleMock,
    eqStatusMock,
    eqListingIdMock,
    selectMock,
    fromMock,
  };
});

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("@/lib/supabaseClient", () => ({
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

function renderButton(listing: Listing, onChange = vi.fn()) {
  render(
    <ChakraProvider value={defaultSystem}>
      <ReserveButton listing={listing} onChange={onChange} />
    </ChakraProvider>,
  );
}

describe("ReserveButton", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    rpcMock.mockReset();
    fromMock.mockClear();
    selectMock.mockClear();
    eqListingIdMock.mockClear();
    eqStatusMock.mockClear();
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
  });

  it('shows "Sign in to reserve" with no session', () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderButton(activeListing());

    expect(
      screen.getByRole("button", { name: "Zum Reservieren anmelden" }),
    ).toBeDisabled();
  });

  it("shows reserve slider and braille and calls reserve_listing with selected count", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });

    renderButton(activeListing());

    expect(screen.getByTestId("braille-quantity-row")).toBeInTheDocument();
    expect(screen.getByTestId("slider-with-value-label")).toHaveTextContent(
      "1",
    );

    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("reserve_listing", {
        p_listing_id: "listing-1",
        p_egg_count: 1,
      }),
    );
  });

  it('shows a disabled "Reserved" state when the listing status is reserved', async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "stranger-1" } },
      loading: false,
    });

    renderButton(activeListing({ status: "reserved" }));

    expect(
      await screen.findByRole("button", { name: "Reserviert" }),
    ).toBeDisabled();
  });

  it("shows a Cancel action for the buyer's own active reservation", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
    maybeSingleMock.mockResolvedValue({
      data: { id: "reservation-1", buyer_id: "buyer-1" },
      error: null,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });

    renderButton(activeListing({ status: "reserved" }));

    const cancelButton = await screen.findByRole("button", {
      name: "Reservierung stornieren",
    });
    fireEvent.click(cancelButton);

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("cancel_reservation", {
        p_reservation_id: "reservation-1",
      }),
    );
  });
});
