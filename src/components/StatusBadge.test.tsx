import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import StatusBadge, { statusColorPalette } from "./StatusBadge";
import type { ListingStatus } from "../lib/listing";

const cases: [ListingStatus, string, string][] = [
  ["active", "Verfügbar", "green"],
  ["reserved", "Reserviert", "yellow"],
  ["sold", "Verkauft", "blue"],
  ["expired", "Abgelaufen", "gray"],
  ["cancelled", "Storniert", "red"],
];

describe("StatusBadge", () => {
  it.each(cases)(
    "renders the correct label and color for status %s",
    (status, label, color) => {
      render(
        <ChakraProvider value={defaultSystem}>
          <StatusBadge status={status} />
        </ChakraProvider>,
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      expect(statusColorPalette(status)).toBe(color);
    },
  );
});
