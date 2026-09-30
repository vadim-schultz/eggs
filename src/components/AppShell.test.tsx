import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import AppShell from "./AppShell";

vi.mock("./MapView", () => ({
  default: ({ selectedId }: { selectedId: string | null }) => (
    <div data-testid="map-view">selected: {selectedId ?? "none"}</div>
  ),
}));

vi.mock("./BuyerTab", () => ({
  default: () => <div data-testid="buyer-tab" />,
}));

function renderShell() {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AppShell />
    </ChakraProvider>,
  );
}

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Menü" }));
}

describe("AppShell", () => {
  it('renders "Eierbauer" as the popover title once opened', () => {
    renderShell();
    openMenu();

    expect(screen.getByText("Eierbauer")).toBeInTheDocument();
  });

  it("renders the farmer/buyer tabs inside the popover body once opened", async () => {
    renderShell();
    openMenu();

    expect(await screen.findByRole("tab", { name: /🧑‍🌾/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /👨🏻‍💼/ })).toBeInTheDocument();
  });

  it("renders MapView as a background element", () => {
    renderShell();

    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });
});
