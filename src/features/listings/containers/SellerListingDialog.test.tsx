import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import SellerListingDialog from "./SellerListingDialog";
import type { Listing } from "@/features/listings/types/listing";

const { useReservationsMock } = vi.hoisted(() => ({
  useReservationsMock: vi.fn(),
}));

vi.mock("@/features/listings/hooks/useSellerReservations", () => ({
  useSellerReservations: useReservationsMock,
}));

vi.mock("@/features/listings/components/ContactReveal", () => ({
  default: () => <div data-testid="contact-reveal" />,
}));

const listing: Listing = {
  id: "listing-1",
  seller_id: "seller-1",
  egg_count: 4,
  unit: "each",
  price_per_egg_cents: 40,
  currency: "EUR",
  location_label: "x",
  note: null,
  status: "active",
  created_at: "2026-01-01T00:00:00Z",
  expires_at: "2026-01-02T10:30:00Z",
};

function res(id: string, eggs: number, listingId = "listing-1") {
  return {
    id,
    egg_count: eggs,
    created_at: "2026-01-01T09:00:00Z",
    listing_id: listingId,
    location_label: "x",
  };
}

function renderDialog() {
  render(
    <ChakraProvider value={defaultSystem}>
      <SellerListingDialog listing={listing} />
    </ChakraProvider>,
  );
}

describe("SellerListingDialog", () => {
  beforeEach(() => useReservationsMock.mockReset());

  it("queries by the listing's seller", () => {
    useReservationsMock.mockReturnValue({ loading: false, reservations: [] });
    renderDialog();
    expect(useReservationsMock).toHaveBeenCalledWith("seller-1");
  });

  it("shows counts, expiry and only this listing's rows", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [res("a", 6), res("b", 10), res("c", 6, "other-listing")],
    });

    renderDialog();

    expect(screen.getByTestId("reserved-count")).toHaveTextContent("16 Eier");
    expect(screen.getByTestId("remaining-count")).toHaveTextContent("4 Eier");
    expect(screen.getByText("Läuft ab")).toBeInTheDocument();
    expect(screen.getAllByTestId("seller-reservation-row")).toHaveLength(2);
  });

  it("shows no status labels for reservations", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [res("a", 6)],
    });

    renderDialog();

    expect(screen.queryByText("Aktiv")).toBeNull();
    expect(screen.queryByText("Storniert")).toBeNull();
  });

  it("shows the empty state and zero reserved with none", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [res("c", 6, "other-listing")],
    });

    renderDialog();

    expect(screen.getByTestId("reserved-count")).toHaveTextContent("0 Eier");
    expect(screen.getByText("Noch keine Reservierungen.")).toBeInTheDocument();
  });

  it("renders no action buttons", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [res("a", 6)],
    });

    renderDialog();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
