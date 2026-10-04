import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SliderWithValue from "./SliderWithValue";

function renderSlider(
  props: Partial<{
    value: number;
    min: number;
    step: number;
    formatValue: (value: number) => string;
    editable: boolean;
    max: number;
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

  describe("editable", () => {
    function amountInput() {
      return screen.getByRole("textbox") as HTMLInputElement;
    }

    function typeAmount(text: string) {
      fireEvent.change(amountInput(), { target: { value: text } });
    }

    it("renders the static label and no input when not editable", () => {
      renderSlider();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByTestId("slider-with-value-label")).toHaveTextContent(
        "7",
      );
    });

    it("commits a typed value on blur", () => {
      const { onValueChange } = renderSlider({ editable: true, max: 100 });
      typeAmount("24");
      fireEvent.blur(amountInput());
      expect(onValueChange).toHaveBeenCalledWith(24);
    });

    it("commits on Enter and clamps to range", () => {
      const { onValueChange } = renderSlider({ editable: true, max: 100 });
      typeAmount("500");
      fireEvent.keyDown(amountInput(), { key: "Enter" });
      expect(onValueChange).toHaveBeenLastCalledWith(100);
      typeAmount("0");
      fireEvent.blur(amountInput());
      expect(onValueChange).toHaveBeenLastCalledWith(1);
    });

    it("reverts on abc or empty without calling onValueChange", () => {
      const { onValueChange } = renderSlider({ editable: true });
      typeAmount("abc");
      fireEvent.blur(amountInput());
      typeAmount("");
      fireEvent.blur(amountInput());
      expect(onValueChange).not.toHaveBeenCalled();
      expect(amountInput().value).toBe("7");
    });

    it("keeps the slider thumb in sync with the value", () => {
      const { container } = renderSlider({
        editable: true,
        value: 24,
        max: 100,
      });
      expect(amountInput().value).toBe("24");
      expect(container.querySelector('[data-part="thumb"]')).toHaveAttribute(
        "aria-valuenow",
        "24",
      );
    });
  });
});
