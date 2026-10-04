import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import SellerListingDialog from "./SellerListingDialog";
import type { Listing } from "@/features/listings/types/listing";

const { useReservationsMock } = vi.hoisted(() => ({
  useReservationsMock: vi.fn(),
}));

vi.mock("@/features/listings/hooks/useListingReservations", () => ({
  useListingReservations: useReservationsMock,
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

function renderDialog() {
  render(
    <ChakraProvider value={defaultSystem}>
      <SellerListingDialog listing={listing} />
    </ChakraProvider>,
  );
}

describe("SellerListingDialog", () => {
  beforeEach(() => useReservationsMock.mockReset());

  it("shows reserved and remaining counts, expiry and reservation rows", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [
        {
          id: "a",
          egg_count: 6,
          status: "active",
          created_at: "2026-01-01T09:00:00Z",
        },
        {
          id: "b",
          egg_count: 10,
          status: "active",
          created_at: "2026-01-01T08:00:00Z",
        },
      ],
    });

    renderDialog();

    expect(screen.getByTestId("reserved-count")).toHaveTextContent("16 Eier");
    expect(screen.getByTestId("remaining-count")).toHaveTextContent("4 Eier");
    expect(screen.getByText("Läuft ab")).toBeInTheDocument();
    expect(screen.getAllByTestId("seller-reservation-row")).toHaveLength(2);
  });

  it("does not count cancelled reservations as reserved", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [
        {
          id: "a",
          egg_count: 6,
          status: "active",
          created_at: "2026-01-01T09:00:00Z",
        },
        {
          id: "b",
          egg_count: 10,
          status: "cancelled",
          created_at: "2026-01-01T08:00:00Z",
        },
      ],
    });

    renderDialog();

    expect(screen.getByTestId("reserved-count")).toHaveTextContent("6 Eier");
  });

  it("shows the empty state and zero reserved with none", () => {
    useReservationsMock.mockReturnValue({ loading: false, reservations: [] });

    renderDialog();

    expect(screen.getByTestId("reserved-count")).toHaveTextContent("0 Eier");
    expect(screen.getByText("Noch keine Reservierungen.")).toBeInTheDocument();
  });

  it("renders no action buttons", () => {
    useReservationsMock.mockReturnValue({
      loading: false,
      reservations: [
        {
          id: "a",
          egg_count: 6,
          status: "active",
          created_at: "2026-01-01T09:00:00Z",
        },
      ],
    });

    renderDialog();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
