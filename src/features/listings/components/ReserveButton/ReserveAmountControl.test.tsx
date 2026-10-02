import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

import { system } from "@/theme";

import ReserveAmountControl from "./ReserveAmountControl";

function renderControl(
  props: Partial<ComponentProps<typeof ReserveAmountControl>> = {},
) {
  const onEggCountChange = vi.fn();
  render(
    <ChakraProvider value={system}>
      <ReserveAmountControl
        eggCount={3}
        maxEggCount={12}
        unit="each"
        onEggCountChange={onEggCountChange}
        {...props}
      />
    </ChakraProvider>,
  );
  return { onEggCountChange };
}

describe("ReserveAmountControl", () => {
  it("renders EggQuantityRow with three outline eggs for count 3", () => {
    renderControl();

    expect(screen.getByTestId("egg-quantity-row")).toBeInTheDocument();
    expect(screen.getAllByTestId("egg-quantity-outline")).toHaveLength(3);
  });
});
