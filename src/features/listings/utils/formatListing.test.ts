import { describe, expect, it } from "vitest";

import { formatPrice } from "./formatListing";

describe("formatPrice", () => {
  it("formats de-DE currency from cents", () => {
    expect(formatPrice(250, "EUR")).toBe("2,50\u00a0€");
  });
});
