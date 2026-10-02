import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/theme";
import { MemoryRouter } from "react-router-dom";

import AppShell from "./AppShell";

vi.mock("@/features/browse/components/MapView", () => ({
  default: ({ selectedId }: { selectedId: string | null }) => (
    <div data-testid="map-view">selected: {selectedId ?? "none"}</div>
  ),
}));

vi.mock("@/features/browse/containers/BuyerTab", () => ({
  default: () => <div data-testid="buyer-tab">buyer search</div>,
}));

vi.mock("@/features/shell/components/FarmerTab", () => ({
  default: () => <div data-testid="farmer-tab" />,
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: () => ({ session: null, loading: false }),
}));

function renderShell() {
  return render(
    <ChakraProvider value={system}>
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("AppShell", () => {
  it("shows the burger menu trigger and buyer search without opening the menu", () => {
    renderShell();

    expect(screen.getByRole("button", { name: "Menü öffnen" })).toBeVisible();
    expect(screen.getByTestId("buyer-tab")).toBeInTheDocument();
    expect(screen.getByText("buyer search")).toBeVisible();
  });

  it('renders "Eierbauer" as the popover title on first paint', () => {
    renderShell();

    expect(screen.getByText("Eierbauer")).toBeInTheDocument();
  });

  it("renders the farmer/buyer tabs inside the popover body on first paint", async () => {
    renderShell();

    expect(await screen.findByRole("tab", { name: /🧑‍🌾/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Käufer/ })).toBeInTheDocument();
  });

  it("renders MapView as a background element", () => {
    renderShell();

    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });

  it("does not import deleted RadiusSelect module", async () => {
    const radiusSelectModule =
      "@/features/browse/components/BuyerTab/RadiusSelect.tsx";
    await expect(
      import(/* @vite-ignore */ radiusSelectModule),
    ).rejects.toThrow();
  });
});
