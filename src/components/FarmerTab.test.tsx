import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import FarmerTab from "./FarmerTab";

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
}));

vi.mock("../auth/useSession", () => ({ useSession: useSessionMock }));

function renderFarmerTab() {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>
        <FarmerTab />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("FarmerTab", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
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
      screen.getByRole("link", { name: "Angebot einstellen" }),
    ).toBeInTheDocument();
  });

  it("renders AuthButton", () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderFarmerTab();

    expect(
      screen.getByRole("button", { name: "Mit Google anmelden" }),
    ).toBeInTheDocument();
  });
});
