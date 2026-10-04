import { Button, ChakraProvider } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { render } from "@testing-library/react";

import { system } from "@/theme";

const renderThemed = (ui: React.ReactElement) =>
  render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

it("recipes · Button colorPalette danger resolves to the danger role", () => {
  renderThemed(<Button colorPalette="danger">Cancel</Button>);
  const button = screen.getByRole("button", { name: "Cancel" });
  expect(button.className).toContain("chakra-button");
  expect(button.className).toMatch(/\S/);
  expect(document.head.innerHTML).toContain("--chakra-colors-danger-solid");
});

it("recipes · unknown colorPalette does not throw", () => {
  expect(() =>
    renderThemed(<Button colorPalette="not-a-palette">Unknown</Button>),
  ).not.toThrow();
  expect(screen.getByRole("button", { name: "Unknown" })).toBeInTheDocument();
});
