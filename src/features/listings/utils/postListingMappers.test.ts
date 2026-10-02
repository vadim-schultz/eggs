import { describe, expect, it } from "vitest";

import { toListingInput } from "./postListingMappers";

describe("postListingMappers", () => {
  it("always maps post form unit to each for create listing", () => {
    const input = toListingInput({
      eggCount: 24,
      unit: "dozen",
      priceEuros: "3.50",
      locationQuery: "Berlin",
      pin: null,
      contactNote: "Hi",
    });

    expect(input.unit).toBe("each");
    expect(input.eggCount).toBe(24);
  });

  it("keeps each when the form already uses each", () => {
    const input = toListingInput({
      eggCount: 10,
      unit: "each",
      priceEuros: "1",
      locationQuery: "Hamburg",
      pin: null,
      contactNote: "Note",
    });

    expect(input.unit).toBe("each");
  });
});
