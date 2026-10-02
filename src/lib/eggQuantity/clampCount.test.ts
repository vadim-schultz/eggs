import { describe, expect, it } from "vitest";

import { clampCount } from "./clampCount";

describe("clampCount", () => {
  it("returns counts between 1 and 100 unchanged", () => {
    expect(clampCount(1)).toBe(1);
    expect(clampCount(50)).toBe(50);
    expect(clampCount(100)).toBe(100);
  });

  it("clamps out-of-range values to 1 or 100", () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(-3)).toBe(1);
    expect(clampCount(101)).toBe(100);
    expect(clampCount(500)).toBe(100);
  });
});
