import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import App from "./App";

function renderAt(path: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("App", () => {
  it('renders Home at "/"', () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: "Kommt in einem späteren Kapitel" }),
    ).toBeInTheDocument();
  });

  it('renders the PostListing placeholder at "/post"', () => {
    renderAt("/post");
    expect(
      screen.getByRole("heading", { name: "Kommt in einem späteren Kapitel" }),
    ).toBeInTheDocument();
  });
});
