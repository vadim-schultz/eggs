import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import KeyValueRow from "./KeyValueRow";

function renderRow() {
  return render(
    <ChakraProvider value={defaultSystem}>
      <KeyValueRow label="Label">
        <span>Value</span>
      </KeyValueRow>
    </ChakraProvider>,
  );
}

function gridRoot(container: HTMLElement) {
  const grid = container.querySelector('[data-testid="key-value-row"]');
  expect(grid).toBeTruthy();
  return grid as HTMLElement;
}

describe("KeyValueRow", () => {
  it("uses a 1fr / 3fr column template on the grid root", () => {
    const { container } = renderRow();

    const columns = getComputedStyle(gridRoot(container)).gridTemplateColumns;

    expect(columns).toMatch(/1fr/);
    expect(columns).toMatch(/3fr/);
  });

  it("does not use equal-width two-column layout", () => {
    const { container } = renderRow();

    const columns = getComputedStyle(gridRoot(container)).gridTemplateColumns;

    expect(columns).not.toMatch(/repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(columns).not.toBe("1fr 1fr");
  });

  it("vertically centres label and value", () => {
    const { container } = renderRow();

    expect(getComputedStyle(gridRoot(container)).alignItems).toBe("center");
  });

  it("does not top-align label and value", () => {
    const { container } = renderRow();

    expect(getComputedStyle(gridRoot(container)).alignItems).not.toBe("start");
  });

  it("renders the label text", () => {
    renderRow();

    expect(screen.getByText("Label")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });
});
