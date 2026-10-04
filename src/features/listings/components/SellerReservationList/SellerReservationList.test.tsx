import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import SellerReservationList from "./SellerReservationList";
import type { SellerReservationRow } from "@/features/listings/utils/reservationRows";

function row(o: Partial<SellerReservationRow> = {}): SellerReservationRow {
  return {
    id: "r1",
    egg_count: 6,
    created_at: "2026-01-01T10:30:00Z",
    listing_id: "l1",
    location_label: "Marktplatz",
    ...o,
  };
}

function renderList(reservations: SellerReservationRow[], showEmpty?: boolean) {
  render(
    <ChakraProvider value={defaultSystem}>
      <SellerReservationList
        reservations={reservations}
        showEmpty={showEmpty}
      />
    </ChakraProvider>,
  );
}

describe("SellerReservationList", () => {
  it("renders one row per reservation with eggs, place and time", () => {
    renderList([
      row(),
      row({ id: "r2", egg_count: 10, location_label: "Hof" }),
    ]);

    expect(screen.getByText("Reservierungen")).toBeInTheDocument();
    const rows = screen.getAllByTestId("seller-reservation-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("6 Eier");
    expect(rows[0]).toHaveTextContent("Marktplatz");
    expect(rows[0]).toHaveTextContent(/\d{2}/);
    expect(rows[1]).toHaveTextContent("10 Eier");
    expect(rows[1]).toHaveTextContent("Hof");
  });

  it("renders nothing when empty and showEmpty is false", () => {
    renderList([]);

    expect(screen.queryByText("Reservierungen")).toBeNull();
    expect(screen.queryByText("Noch keine Reservierungen.")).toBeNull();
  });

  it("renders title and empty text when empty with showEmpty", () => {
    renderList([], true);

    expect(screen.getByText("Reservierungen")).toBeInTheDocument();
    expect(screen.getByText("Noch keine Reservierungen.")).toBeInTheDocument();
  });

  it("renders no buttons", () => {
    renderList([row()]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
