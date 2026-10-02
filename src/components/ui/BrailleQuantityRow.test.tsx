import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BrailleQuantityRow from "./BrailleQuantityRow";

function renderRow(eggCount: number, unit: "each" | "dozen" = "each") {
  return render(
    <ChakraProvider value={defaultSystem}>
      <BrailleQuantityRow eggCount={eggCount} unit={unit} />
    </ChakraProvider>,
  );
}

describe("BrailleQuantityRow", () => {
  it("shows braille for the total egg count", () => {
    renderRow(7);

    expect(screen.getByTestId("braille-quantity-row")).toHaveTextContent(
      "\u283f\u2801",
    );
  });

  it("keeps braille on one line with ellipsis overflow", () => {
    const { getByTestId } = renderRow(1);

    const row = getByTestId("braille-quantity-row");
    const style = getComputedStyle(row);

    expect(style.whiteSpace).toBe("nowrap");
    expect(style.textOverflow).toBe("ellipsis");
  });
});
