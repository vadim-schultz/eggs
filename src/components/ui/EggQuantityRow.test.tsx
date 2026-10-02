import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { system } from "@/theme";

import EggQuantityRow from "./EggQuantityRow";

function renderRow(count: number) {
  return render(
    <ChakraProvider value={system}>
      <EggQuantityRow count={count} />
    </ChakraProvider>,
  );
}

describe("EggQuantityRow", () => {
  it("renders nine outline icons for count 9", () => {
    renderRow(9);
    expect(screen.getAllByTestId("egg-quantity-outline")).toHaveLength(9);
    expect(screen.queryAllByTestId("egg-quantity-filled")).toHaveLength(0);
  });

  it("renders one filled icon for count 10", () => {
    renderRow(10);
    expect(screen.getAllByTestId("egg-quantity-filled")).toHaveLength(1);
    expect(screen.queryAllByTestId("egg-quantity-outline")).toHaveLength(0);
  });

  it("renders one filled and five outline icons for count 15", () => {
    renderRow(15);
    expect(screen.getAllByTestId("egg-quantity-filled")).toHaveLength(1);
    expect(screen.getAllByTestId("egg-quantity-outline")).toHaveLength(5);
  });

  it("clamps display count above 100 to ten filled eggs", () => {
    renderRow(150);
    expect(screen.getAllByTestId("egg-quantity-filled")).toHaveLength(10);
    expect(screen.queryAllByTestId("egg-quantity-outline")).toHaveLength(0);
  });
});
