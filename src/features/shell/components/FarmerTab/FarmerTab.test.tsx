import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import FarmerTab from "./FarmerTab";

const { useSessionMock, useAppDialogMock, useSellerReservationsMock } =
  vi.hoisted(() => ({
    useSessionMock: vi.fn(),
    useAppDialogMock: vi.fn(),
    useSellerReservationsMock: vi.fn(),
  }));

vi.mock("@/features/listings/hooks/useSellerReservations", () => ({
  useSellerReservations: useSellerReservationsMock,
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));
vi.mock("@/features/shell/context/appDialog", () => ({
  useAppDialog: useAppDialogMock,
}));

function renderFarmerTab() {
  render(
    <ChakraProvider value={defaultSystem}>
      <FarmerTab />
    </ChakraProvider>,
  );
}

describe("FarmerTab", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    useAppDialogMock.mockReset();
    useSellerReservationsMock.mockReset();
    useSellerReservationsMock.mockReturnValue({
      reservations: [],
      loading: false,
    });
    useAppDialogMock.mockReturnValue({
      openPostDialog: vi.fn(),
      openDetailDialog: vi.fn(),
      closeDialog: vi.fn(),
      open: null,
    });
  });

  it("shows the sign-in-required message when signed out", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderFarmerTab();

    expect(
      screen.getByText("Bitte melde dich an, um ein Angebot einzustellen."),
    ).toBeInTheDocument();
  });

  it('shows an "add listing" trigger when signed in', () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "u1" } },
      loading: false,
    });

    renderFarmerTab();

    expect(
      screen.getByRole("button", { name: "Angebot einstellen" }),
    ).toBeInTheDocument();
  });

  it("opens the post dialog when the add-listing trigger is clicked", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "u1" } },
      loading: false,
    });
    const openPostDialog = vi.fn();
    useAppDialogMock.mockReturnValue({
      openPostDialog,
      openDetailDialog: vi.fn(),
      closeDialog: vi.fn(),
      open: null,
    });

    renderFarmerTab();
    fireEvent.click(screen.getByRole("button", { name: "Angebot einstellen" }));

    expect(openPostDialog).toHaveBeenCalled();
  });

  it("renders AuthButton", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderFarmerTab();

    expect(
      screen.getByRole("button", { name: "Mit Google anmelden" }),
    ).toBeInTheDocument();
  });

  it("shows reservation rows below the add-listing button when signed in", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "u1" } },
      loading: false,
    });
    useSellerReservationsMock.mockReturnValue({
      loading: false,
      reservations: [
        {
          id: "r1",
          egg_count: 6,
          created_at: "2026-01-01T10:30:00Z",
          listing_id: "l1",
          location_label: "Marktplatz",
        },
      ],
    });

    renderFarmerTab();

    const add = screen.getByRole("button", { name: "Angebot einstellen" });
    const row = screen.getByTestId("seller-reservation-row");
    expect(row).toHaveTextContent("6 Eier");
    expect(
      add.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(useSellerReservationsMock).toHaveBeenCalledWith("u1");
  });

  it("renders no list and runs no reservation query when signed out", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderFarmerTab();

    expect(screen.queryByText("Reservierungen")).toBeNull();
    expect(useSellerReservationsMock).not.toHaveBeenCalled();
  });

  it("renders no heading when signed in with no reservations", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "u1" } },
      loading: false,
    });

    renderFarmerTab();

    expect(screen.queryByText("Reservierungen")).toBeNull();
  });
});
