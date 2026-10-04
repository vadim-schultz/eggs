import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import SellerReservations from "./SellerReservations";
import type { ListingReservationRow } from "@/features/listings/services/listingsApi";

function row(o: Partial<ListingReservationRow> = {}): ListingReservationRow {
  return {
    id: "r1",
    egg_count: 6,
    status: "active",
    created_at: "2026-01-01T10:30:00Z",
    ...o,
  };
}

function renderList(reservations: ListingReservationRow[]) {
  render(
    <ChakraProvider value={defaultSystem}>
      <SellerReservations reservations={reservations} />
    </ChakraProvider>,
  );
}

describe("SellerReservations", () => {
  it("renders one row per reservation with egg count and status", () => {
    renderList([row(), row({ id: "r2", egg_count: 10, status: "cancelled" })]);

    expect(screen.getAllByTestId("seller-reservation-row")).toHaveLength(2);
    expect(screen.getByText("6 Eier")).toBeInTheDocument();
    expect(screen.getByText("10 Eier")).toBeInTheDocument();
    expect(screen.getByText("Aktiv")).toBeInTheDocument();
    expect(screen.getByText("Storniert")).toBeInTheDocument();
  });

  it("renders the empty state when there are none", () => {
    renderList([]);

    expect(screen.getByText("Noch keine Reservierungen.")).toBeInTheDocument();
    expect(screen.queryByTestId("seller-reservation-row")).toBeNull();
  });

  it("renders no buttons", () => {
    renderList([row()]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
