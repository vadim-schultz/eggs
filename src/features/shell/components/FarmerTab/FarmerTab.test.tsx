import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import FarmerTab from "./FarmerTab";

const { useSessionMock, useAppDialogMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  useAppDialogMock: vi.fn(),
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
    useSessionMock.mockReturnValue({ session: {}, loading: false });

    renderFarmerTab();

    expect(
      screen.getByRole("button", { name: "Angebot einstellen" }),
    ).toBeInTheDocument();
  });

  it("opens the post dialog when the add-listing trigger is clicked", () => {
    useSessionMock.mockReturnValue({ session: {}, loading: false });
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
});
