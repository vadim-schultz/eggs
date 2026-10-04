import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import ListingDetail from "./ListingDetail";
import type { Listing } from "@/features/listings/types/listing";

const { singleMock, eqMock, selectMock, fromMock, useSessionMock } = vi.hoisted(
  () => {
    const singleMock = vi.fn();
    const chain: Record<string, unknown> = { single: singleMock };
    const eqMock = vi.fn(() => chain);
    const gtMock = vi.fn(() => chain);
    chain.eq = eqMock;
    chain.gt = gtMock;
    const selectMock = vi.fn(() => ({ eq: eqMock }));
    const fromMock = vi.fn(() => ({ select: selectMock }));
    const useSessionMock = vi.fn();
    return { singleMock, eqMock, selectMock, fromMock, useSessionMock };
  },
);

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

vi.mock("@/features/listings/components/ReserveButton", () => ({
  default: () => <div data-testid="reserve-button" />,
}));

vi.mock("@/features/listings/components/ContactReveal", () => ({
  default: ({ listingId }: { listingId: string }) => (
    <div data-testid="contact-reveal">{listingId}</div>
  ),
}));

vi.mock("@/features/listings/hooks/useListingReservations", () => ({
  useListingReservations: () => ({ reservations: [], loading: false }),
}));

function activeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: "listing-1",
    seller_id: "seller-1",
    egg_count: 12,
    unit: "dozen",
    price_per_egg_cents: 400,
    currency: "EUR",
    location_label: "Downtown, near the market",
    note: null,
    status: "active",
    created_at: "2026-01-01T00:00:00Z",
    expires_at: "2026-01-04T00:00:00Z",
    ...overrides,
  };
}

function renderAt(id: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <ListingDetail id={id} />
    </ChakraProvider>,
  );
}

describe("ListingDetail", () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    singleMock.mockReset();
    useSessionMock.mockReset();
    useSessionMock.mockReturnValue({
      session: { user: { id: "buyer-1" } },
      loading: false,
    });
  });

  it("buyer dialog shows no available, price-per-egg or status rows", async () => {
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");
    await screen.findByTestId("reserve-button");

    expect(screen.queryByText("Verfügbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Preis pro Ei")).not.toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(screen.queryByTestId("key-value-row")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Downtown, near the market"),
    ).not.toBeInTheDocument();
    expect(fromMock).toHaveBeenCalledWith("listing");
    expect(eqMock).toHaveBeenCalledWith("id", "listing-1");
  });

  it("non-owner gets the buyer dialog with ReserveButton and contact reveal", async () => {
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");
    await screen.findByTestId("reserve-button");

    expect(screen.getByTestId("reserve-button")).toBeInTheDocument();
    expect(screen.getByTestId("contact-reveal")).toHaveTextContent("listing-1");
  });

  it("owner gets the seller dialog with summary and own contact note", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
    singleMock.mockResolvedValue({
      data: activeListing({ seller_id: "seller-1" }),
      error: null,
    });

    renderAt("listing-1");
    await screen.findByTestId("contact-reveal");

    expect(screen.getByText("Preis pro Ei")).toBeInTheDocument();
    expect(screen.getByTestId("contact-reveal")).toHaveTextContent("listing-1");
  });

  it("owner never sees the reserve button", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
    singleMock.mockResolvedValue({
      data: activeListing({ seller_id: "seller-1" }),
      error: null,
    });

    renderAt("listing-1");
    await screen.findByTestId("contact-reveal");

    expect(screen.queryByTestId("reserve-button")).not.toBeInTheDocument();
    expect(screen.queryByText(/Reservieren/)).not.toBeInTheDocument();
  });

  it("buyer view renders no seller-only content", async () => {
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");
    await screen.findByTestId("reserve-button");

    expect(
      screen.queryByText(/Als verkauft markieren/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Angebot zurückziehen/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ablaufdatum/)).not.toBeInTheDocument();
  });

  it("signed-out viewer gets the buyer dialog", async () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });
    singleMock.mockResolvedValue({ data: activeListing(), error: null });

    renderAt("listing-1");

    expect(await screen.findByTestId("reserve-button")).toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  it("owner dialog shows amount and price but no status", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "seller-1" } },
      loading: false,
    });
    singleMock.mockResolvedValue({
      data: activeListing({ seller_id: "seller-1", status: "reserved" }),
      error: null,
    });

    renderAt("listing-1");
    await screen.findByTestId("contact-reveal");

    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  it("shows the not-found message when the listing can't be loaded", async () => {
    singleMock.mockResolvedValue({ data: null, error: null });

    renderAt("missing-listing");

    expect(
      await screen.findByText("Angebot nicht gefunden."),
    ).toBeInTheDocument();
  });
});
