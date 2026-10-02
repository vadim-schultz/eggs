import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SliderWithValue from "./SliderWithValue";

function renderSlider(
  props: Partial<{
    value: number;
    min: number;
    max: number;
    step: number;
    formatValue: (value: number) => string;
  }> = {},
) {
  const onValueChange = vi.fn();
  const view = render(
    <ChakraProvider value={defaultSystem}>
      <SliderWithValue
        min={1}
        max={12}
        step={1}
        value={7}
        onValueChange={onValueChange}
        {...props}
      />
    </ChakraProvider>,
  );
  return { ...view, onValueChange };
}

function sliderControl(container: HTMLElement) {
  const control = container.querySelector('[data-part="control"]');
  expect(control).toBeTruthy();
  return control as HTMLElement;
}

describe("SliderWithValue", () => {
  it("renders the value label before the slider control in DOM order", () => {
    const { container } = renderSlider({ formatValue: (v) => `${v} eggs` });

    const label = screen.getByTestId("slider-with-value-label");
    const control = sliderControl(container);

    expect(
      label.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(label).toHaveTextContent("7 eggs");
  });

  it("does not place the value label only inside the thumb", () => {
    const { container } = renderSlider();

    const label = screen.getByTestId("slider-with-value-label");
    const thumb = container.querySelector('[data-part="thumb"]');

    expect(label).toHaveTextContent("7");
    if (thumb) {
      expect(thumb.contains(label)).toBe(false);
    }
    expect(screen.getByText("7")).toBe(label);
  });
});
