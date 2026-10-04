import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";

import StatusBadge, { statusColorPalette } from "./StatusBadge";
import type { ListingStatus } from "@/features/listings/types/listing";

const cases: [ListingStatus, string, string][] = [
  ["active", "Verfügbar", "success"],
  ["reserved", "Reserviert", "warning"],
  ["sold", "Verkauft", "secondary"],
  ["expired", "Abgelaufen", "info"],
  ["cancelled", "Storniert", "danger"],
];

describe("StatusBadge", () => {
  it.each(cases)(
    "renders the correct label and color for status %s",
    (status, label, color) => {
      render(
        <ChakraProvider value={system}>
          <StatusBadge status={status} />
        </ChakraProvider>,
      );

      expect(screen.getByText(label)).toBeInTheDocument();
      expect(statusColorPalette(status)).toBe(color);
    },
  );

  it("rejects an unknown status instead of falling back", () => {
    expect(() => statusColorPalette("bogus" as ListingStatus)).toThrow();
  });

  it("renders with the compact xs size", () => {
    const { container: badgeContainer } = render(
      <ChakraProvider value={system}>
        <StatusBadge status="active" />
      </ChakraProvider>,
    );
    const { container: xsReference } = render(
      <ChakraProvider value={system}>
        <Badge colorPalette="success" size="xs" />
      </ChakraProvider>,
    );
    const { container: smReference } = render(
      <ChakraProvider value={system}>
        <Badge colorPalette="success" size="sm" />
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
