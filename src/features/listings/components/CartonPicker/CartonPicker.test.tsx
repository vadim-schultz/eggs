import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import type { CartonSize } from "../../utils/carton";
import CartonPicker from "./CartonPicker";

function Harness({
  remaining,
  onChange,
}: {
  remaining: number;
  onChange: (s: CartonSize) => void;
}) {
  const [value, setValue] = useState<CartonSize | null>(null);
  return (
    <ChakraProvider value={defaultSystem}>
      <CartonPicker
        currency="EUR"
        onChange={(s) => {
          setValue(s);
          onChange(s);
        }}
        pricePerEggCents={35}
        remaining={remaining}
        value={value}
      />
    </ChakraProvider>
  );
}

function renderPicker(remaining: number) {
  const onChange = vi.fn();
  const { container } = render(
    <Harness onChange={onChange} remaining={remaining} />,
  );
  return { onChange, container };
}

describe("CartonPicker", () => {
  it("renders two cards with carton prices and no radio inputs", () => {
    const { container } = renderPicker(20);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(container.querySelector("input[type=radio]")).toBeNull();
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Kartongröße");
    expect(screen.getByText(/2,10/)).toBeInTheDocument();
    expect(screen.getByText(/3,50/)).toBeInTheDocument();
  });

  it("selects the clicked card and unselects the other", () => {
    const { onChange } = renderPicker(20);
    fireEvent.click(screen.getByRole("radio", { name: "10 Eier" }));
    expect(onChange).toHaveBeenCalledWith(10);
    expect(screen.getByRole("radio", { name: "10 Eier" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "6 Eier" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("disables the 10 card when only 8 remain", () => {
    const { onChange } = renderPicker(8);
    const ten = screen.getByRole("radio", { name: "10 Eier" });
    expect(ten).toBeDisabled();
    expect(screen.getByTitle("Nicht genug Eier übrig")).toBeInTheDocument();
    fireEvent.click(ten);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables both cards when only 4 remain", () => {
    renderPicker(4);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("shows only eggs and the carton price", () => {
    renderPicker(20);
    expect(screen.queryByText(/Verfügbar/i)).toBeNull();
    expect(screen.queryByText(/pro Ei/i)).toBeNull();
    expect(screen.queryByText(/0,35/)).toBeNull();
  });
});
