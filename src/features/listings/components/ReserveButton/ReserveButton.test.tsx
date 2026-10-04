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
  signInWithOAuthMock,
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
    signInWithOAuthMock: vi.fn(),
  };
});

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: fromMock,
    rpc: rpcMock,
    auth: { signInWithOAuth: signInWithOAuthMock },
  },
}));

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_per_egg_cents: 400,
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
    signInWithOAuthMock.mockReset();
    rpcMock.mockReset();
    fromMock.mockClear();
    selectMock.mockClear();
    eqListingIdMock.mockClear();
    eqStatusMock.mockClear();
    maybeSingleMock.mockReset();
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
  });

  it("starts the Google login from an enabled sign-in button", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderButton(activeListing());
    const button = screen.getByRole("button", {
      name: "Zum Reservieren anmelden",
    });
    expect(button).toBeEnabled();
    fireEvent.click(button);

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  });

  it("shows no sign-in button and the carton picker when signed in", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });

    renderButton(activeListing());

    expect(
      screen.queryByRole("button", { name: "Zum Reservieren anmelden" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders nothing while the session is loading", () => {
    useSessionMock.mockReturnValue({ session: null, loading: true });

    renderButton(activeListing());

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  function signIn() {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });
  }

  function reserveCalls() {
    return rpcMock.mock.calls.filter(([name]) => name === "reserve_listing");
  }

  it("defaults to the 6-carton and reserves 6", async () => {
    signIn();
    renderButton(activeListing());

    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("reserve_listing", {
        p_listing_id: "listing-1",
        p_egg_count: 6,
      }),
    );
  });

  it("reserves 10 after picking the 10-carton and shows both carton prices", async () => {
    signIn();
    renderButton(activeListing());

    expect(screen.getByText(/24,00\s?€/)).toBeInTheDocument();
    expect(screen.getByText(/40,00\s?€/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("carton-eggs-10"));
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "10 Eier" })).toBeChecked(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith("reserve_listing", {
        p_listing_id: "listing-1",
        p_egg_count: 10,
      }),
    );
    expect(reserveCalls().map(([, args]) => args.p_egg_count)).toEqual([10]);
  });

  it("disables the 10-carton with 8 eggs but still reserves 6", async () => {
    signIn();
    renderButton(activeListing({ egg_count: 8 }));

    expect(screen.getByRole("radio", { name: "10 Eier" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "6 Eier" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    await waitFor(() => expect(reserveCalls()).toHaveLength(1));
    expect(reserveCalls()[0][1].p_egg_count).toBe(6);
  });

  it("disables reserve and shows a note when no carton fits", () => {
    signIn();
    renderButton(activeListing({ egg_count: 4 }));

    expect(screen.getByRole("radio", { name: "6 Eier" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "10 Eier" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reservieren" })).toBeDisabled();
    expect(
      screen.getByText("Nicht genug Eier für einen Karton"),
    ).toBeInTheDocument();
    expect(reserveCalls()).toHaveLength(0);
  });

  it("renders no slider in the reserve area", () => {
    signIn();
    renderButton(activeListing());

    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
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

  it("shows an egg burst after a successful reserve", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: {}, error: null });
    renderButton(activeListing());

    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    expect(await screen.findByTestId("egg-burst")).toBeInTheDocument();
  });

  it("does not show an egg burst when reserving fails", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    renderButton(activeListing());

    fireEvent.click(screen.getByRole("button", { name: "Reservieren" }));

    await screen.findByText(/Ei ist runtergefallen/);
    expect(screen.queryByTestId("egg-burst")).not.toBeInTheDocument();
  });
});
