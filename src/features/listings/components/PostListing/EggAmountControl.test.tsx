import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("textbox")).toHaveValue("42");
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

  it("lets the seller type an amount that moves the slider", () => {
    const { onEggCountChange } = renderControl({ eggCount: 12 });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "24" } });
    fireEvent.blur(screen.getByRole("textbox"));

    expect(onEggCountChange).toHaveBeenCalledWith(24);
  });
});
