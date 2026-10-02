import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EggAmountControl from "./EggAmountControl";

function renderControl(
  props: Partial<{
    eggCount: number;
    onEggCountChange: (count: number) => void;
  }> = {},
) {
  const onEggCountChange = vi.fn();
  const view = render(
    <ChakraProvider value={defaultSystem}>
      <EggAmountControl
        eggCount={props.eggCount ?? 12}
        onEggCountChange={props.onEggCountChange ?? onEggCountChange}
      />
    </ChakraProvider>,
  );
  return { onEggCountChange, ...view };
}

describe("EggAmountControl", () => {
  it("renders the egg quantity row and a slider capped at 100", () => {
    const { container } = renderControl({ eggCount: 42 });

    expect(screen.getByTestId("egg-quantity-row")).toBeInTheDocument();
    expect(screen.getByTestId("slider-with-value-label")).toHaveTextContent(
      "42",
    );
    const thumb = container.querySelector('[data-part="thumb"]');
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
    expect(thumb).toHaveAttribute("aria-valuemin", "1");
  });

  it("does not render Stück/Dutzend unit chips", () => {
    renderControl();

    expect(screen.queryByTestId("unit-chip-row")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Stück" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Dutzend" }),
    ).not.toBeInTheDocument();
  });
});
