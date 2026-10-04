import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/theme";
import PublishedNotice from "./PublishedNotice";

describe("PublishedNotice", () => {
  it("announces the publication and the 24 hour expiry only", () => {
    render(
      <ChakraProvider value={system}>
        <PublishedNotice />
      </ChakraProvider>,
    );

    expect(
      screen.getByText("Dein Angebot wurde veröffentlicht."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Es läuft in 24 Stunden ab."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
