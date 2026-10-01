import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";

import { formatPrice } from "@/features/listings/utils/formatListing";

import ListingSummaryLine from "./ListingSummaryLine";

function priceText(cents: number, currency: string): string {
  return formatPrice(cents, currency).replaceAll("\u00a0", " ");
}

function renderLine(props: ComponentProps<typeof ListingSummaryLine>) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ListingSummaryLine {...props} />
    </ChakraProvider>,
  );
}

describe("ListingSummaryLine", () => {
  it("renders egg count, translated unit, and formatted EUR price", () => {
    renderLine({
      eggCount: 12,
      unit: "dozen",
      priceCents: 250,
      currency: "EUR",
    });

    expect(
      screen.getByText(`12 Dutzend · ${priceText(250, "EUR")}`),
    ).toBeInTheDocument();
  });

  it("renders an empty separator without crashing", () => {
    renderLine({
      eggCount: 0,
      unit: "each",
      priceCents: 0,
      currency: "EUR",
      separator: "",
    });

    expect(
      screen.getByText(`0 Stück${priceText(0, "EUR")}`),
    ).toBeInTheDocument();
  });
});
