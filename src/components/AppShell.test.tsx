import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import AppShell from "./AppShell";

vi.mock("./MapView", () => ({
  default: () => <div data-testid="map-view" />,
}));

function renderShell(children: React.ReactNode) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AppShell>{children}</AppShell>
    </ChakraProvider>,
  );
}

describe("AppShell", () => {
  it('renders "Eierbauer" as the panel title', () => {
    renderShell(<div />);

    expect(screen.getByText("Eierbauer")).toBeInTheDocument();
  });

  it("renders its children inside the floating panel body", () => {
    renderShell(<div>panel content</div>);

    expect(screen.getByText("panel content")).toBeInTheDocument();
  });

  it("renders MapView as a background element", () => {
    renderShell(<div />);

    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });
});
