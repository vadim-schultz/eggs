import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { ColorModeProvider } from "@/components/ui/color-mode";
import { system } from "@/theme";

/** Render a tree with Chakra, color mode, and router — matches production provider stack. */
export function renderWithProviders(ui: ReactElement) {
  return render(
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </ColorModeProvider>
    </ChakraProvider>,
  );
}
