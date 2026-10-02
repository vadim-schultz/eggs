import { describe, expect, it } from "vitest";

import { renderEggQuantityBraille } from "./render";

describe("renderEggQuantityBraille", () => {
  it("renders full cells and tail for mixed totals", () => {
    expect(renderEggQuantityBraille(7)).toBe("\u283f\u2801");
    expect(renderEggQuantityBraille(12)).toBe("\u283f\u283f");
    expect(renderEggQuantityBraille(1)).toBe("\u2801");
  });

  it("uses a single full cell for exactly six eggs", () => {
    const six = renderEggQuantityBraille(6);

    expect(six).toBe("\u283f");
    expect(six).not.toBe("\u283f\u283f");
  });
});
