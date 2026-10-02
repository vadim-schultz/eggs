import { describe, expect, it } from "vitest";

import { slotsForCount } from "./slotsForCount";

function kinds(n: number) {
  return slotsForCount(n).map((slot) => slot.kind);
}

describe("slotsForCount", () => {
  it("maps 9, 10, 15, and 100 to the decade row layout", () => {
    expect(kinds(9)).toEqual([
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "empty",
    ]);
    expect(kinds(10)).toEqual([
      "filled",
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
      "empty",
    ]);
    expect(kinds(15)).toEqual([
      "filled",
      "outline",
      "outline",
      "outline",
      "outline",
      "outline",
      "empty",
      "empty",
      "empty",
      "empty",
    ]);
    expect(kinds(100)).toEqual(Array(10).fill("filled"));
  });

  it("throws RangeError when count is below 1 or above 100", () => {
    expect(() => slotsForCount(0)).toThrow(RangeError);
    expect(() => slotsForCount(101)).toThrow(RangeError);
  });
});
