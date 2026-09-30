import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import App from "./App";

vi.mock("./components/MapView", () => ({
  default: () => null,
}));

vi.mock("./components/BuyerTab", () => ({
  default: () => null,
}));

function renderAt(path: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ChakraProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Menü" }));
}

describe("App", () => {
  it.each(["/", "/post", "/listings/abc"])(
    "renders the farmer/buyer tabs at %s",
    async (path) => {
      renderAt(path);

      expect(
        await screen.findByRole("tab", { name: /🧑‍🌾/ }),
      ).toBeInTheDocument();
    },
  );
});
