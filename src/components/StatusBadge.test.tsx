import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, ChakraProvider, defaultSystem } from "@chakra-ui/react";

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

  it("renders with the compact xs size", () => {
    const { container: badgeContainer } = render(
      <ChakraProvider value={defaultSystem}>
        <StatusBadge status="active" />
      </ChakraProvider>,
    );
    const { container: xsReference } = render(
      <ChakraProvider value={defaultSystem}>
        <Badge colorPalette="green" size="xs" />
      </ChakraProvider>,
    );
    const { container: smReference } = render(
      <ChakraProvider value={defaultSystem}>
        <Badge colorPalette="green" size="sm" />
      </ChakraProvider>,
    );

    const badgeClass = badgeContainer.querySelector(".chakra-badge")!.className;
    expect(badgeClass).toBe(
      xsReference.querySelector(".chakra-badge")!.className,
    );
    expect(badgeClass).not.toBe(
      smReference.querySelector(".chakra-badge")!.className,
    );
  });
});
