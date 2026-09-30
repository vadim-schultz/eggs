import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import AppShell from "./AppShell";
import { usePublishBackgroundMap } from "./BackgroundMap";

vi.mock("./MapView", () => ({
  default: ({ selectedId }: { selectedId: string | null }) => (
    <div data-testid="map-view">selected: {selectedId ?? "none"}</div>
  ),
}));

function renderShell(children: React.ReactNode) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AppShell>{children}</AppShell>
    </ChakraProvider>,
  );
}

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Menü" }));
}

describe("AppShell", () => {
  it('renders "Eierbauer" as the popover title once opened', () => {
    renderShell(<div />);
    openMenu();

    expect(screen.getByText("Eierbauer")).toBeInTheDocument();
  });

  it("renders its children inside the popover body once opened", () => {
    renderShell(<div>panel content</div>);
    openMenu();

    expect(screen.getByText("panel content")).toBeInTheDocument();
  });

  it("renders MapView as a background element", () => {
    renderShell(<div />);

    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });

  it("reflects a child's published background map selection once opened", () => {
    function Publisher() {
      usePublishBackgroundMap({
        center: { lat: 52.52, lng: 13.405 },
        listings: [],
        selectedId: "listing-9",
        onSelect: () => {},
      });
      return null;
    }

    renderShell(<Publisher />);
    openMenu();

    expect(screen.getByTestId("map-view")).toHaveTextContent(
      "selected: listing-9",
    );
  });
});
