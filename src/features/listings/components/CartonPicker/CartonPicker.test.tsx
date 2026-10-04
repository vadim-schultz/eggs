import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CartonPicker from "./CartonPicker";

function renderPicker(remaining: number) {
  const onChange = vi.fn();
  render(
    <ChakraProvider value={defaultSystem}>
      <CartonPicker
        currency="EUR"
        onChange={onChange}
        pricePerEggCents={35}
        remaining={remaining}
        value={null}
      />
    </ChakraProvider>,
  );
  return onChange;
}

describe("CartonPicker", () => {
  it("renders exactly two radios and both cartons", () => {
    renderPicker(20);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByTestId("carton-eggs-6")).toBeInTheDocument();
    expect(screen.getByTestId("carton-eggs-10")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Kartongröße");
  });

  it("shows size × per-egg price under each carton", () => {
    renderPicker(20);
    expect(screen.getByText(/2,10/)).toBeInTheDocument();
    expect(screen.getByText(/3,50/)).toBeInTheDocument();
  });

  it("calls onChange when clicking a radio or the eggs", async () => {
    const onChange = renderPicker(20);
    fireEvent.click(screen.getByRole("radio", { name: "6 Eier" }));
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(6));
    fireEvent.click(screen.getByTestId("carton-eggs-10"));
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(10));
  });

  it("disables the 10 carton when only 8 remain", async () => {
    const onChange = renderPicker(8);
    expect(screen.getByRole("radio", { name: "10 Eier" })).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: "10 Eier" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("radio", { name: "6 Eier" }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(6));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("disables both cartons when only 4 remain", () => {
    renderPicker(4);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });
});
