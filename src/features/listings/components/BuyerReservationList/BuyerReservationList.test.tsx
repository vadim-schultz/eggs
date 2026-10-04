import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import BuyerReservationList from "./BuyerReservationList";
import type { BuyerReservationRow } from "@/features/listings/utils/reservationRows";

const { cancelReservationMock } = vi.hoisted(() => ({
  cancelReservationMock: vi.fn(),
}));

vi.mock("@/features/listings/services/listingsApi", () => ({
  cancelReservation: cancelReservationMock,
}));

function row(o: Partial<BuyerReservationRow> = {}): BuyerReservationRow {
  return {
    id: "r1",
    egg_count: 6,
    created_at: "2026-01-01T10:30:00Z",
    listing_id: "l1",
    location_label: "Marktplatz",
    contact_note: "Klingel am Tor",
    ...o,
  };
}

function renderList(reservations: BuyerReservationRow[], onChange = vi.fn()) {
  render(
    <ChakraProvider value={defaultSystem}>
      <BuyerReservationList reservations={reservations} onChange={onChange} />
    </ChakraProvider>,
  );
  return onChange;
}

describe("BuyerReservationList", () => {
  beforeEach(() => cancelReservationMock.mockReset());

  it("renders rows with eggs, place, time and contact hint", () => {
    renderList([
      row(),
      row({ id: "r2", egg_count: 10, location_label: "Hof" }),
    ]);

    const rows = screen.getAllByTestId("buyer-reservation-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("6 Eier");
    expect(rows[0]).toHaveTextContent("Marktplatz");
    expect(rows[0]).toHaveTextContent(/\d{2}/);
    expect(rows[0]).toHaveTextContent("Kontakthinweis: Klingel am Tor");
    expect(rows[1]).toHaveTextContent("10 Eier");
  });

  it("renders nothing when there are no reservations", () => {
    const { container } = render(
      <ChakraProvider value={defaultSystem}>
        <BuyerReservationList reservations={[]} onChange={vi.fn()} />
      </ChakraProvider>,
    );
    expect(screen.queryByTestId("buyer-reservation-row")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.textContent).toBe("");
  });

  it("omits the contact line when there is no note", () => {
    renderList([row({ contact_note: null })]);
    expect(screen.queryByText(/Kontakthinweis/)).toBeNull();
  });

  it("cancels the reservation then calls onChange", async () => {
    cancelReservationMock.mockResolvedValue({});
    const onChange = renderList([row()]);

    fireEvent.click(
      screen.getByRole("button", { name: "Reservierung stornieren" }),
    );

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(cancelReservationMock).toHaveBeenCalledWith("r1");
  });

  it("shows an error and skips onChange when cancel fails", async () => {
    cancelReservationMock.mockResolvedValue({ error: true });
    const onChange = renderList([row()]);

    fireEvent.click(
      screen.getByRole("button", { name: "Reservierung stornieren" }),
    );

    expect(await screen.findByText(/Ups, das Ei/)).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
