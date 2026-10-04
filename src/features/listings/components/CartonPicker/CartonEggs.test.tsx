import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CartonEggs from "./CartonEggs";

function renderEggs(size: 6 | 10) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <CartonEggs size={size} />
    </ChakraProvider>,
  );
}

describe("CartonEggs", () => {
  it.each([6, 10] as const)("renders %i egg icons", (size) => {
    renderEggs(size);
    const grid = screen.getByTestId(`carton-eggs-${size}`);
    expect(grid.querySelectorAll("svg")).toHaveLength(size);
  });

  it("does not colour all eggs the same", () => {
    renderEggs(10);
    const grid = screen.getByTestId("carton-eggs-10");
    const classes = Array.from(grid.querySelectorAll("[data-egg]")).map(
      (el) => el.className,
    );
    expect(new Set(classes).size).toBeGreaterThan(1);
  });
});
