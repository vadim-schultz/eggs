import { ChakraProvider, defaultSystem, RadioGroup } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CartonOption from "./CartonOption";

function renderOption(remaining: number) {
  render(
    <ChakraProvider value={defaultSystem}>
      <RadioGroup.Root value="">
        <CartonOption
          currency="EUR"
          pricePerEggCents={35}
          remaining={remaining}
          size={10}
        />
      </RadioGroup.Root>
    </ChakraProvider>,
  );
}

describe("CartonOption", () => {
  it("shows the carton price", () => {
    renderOption(12);
    expect(screen.getByText(/3,50/)).toBeInTheDocument();
  });

  it("is disabled with a hint when not enough eggs remain", () => {
    renderOption(8);
    expect(screen.getByRole("radio", { name: "10 Eier" })).toBeDisabled();
    expect(screen.getByTitle("Nicht genug Eier übrig")).toBeInTheDocument();
  });
});
