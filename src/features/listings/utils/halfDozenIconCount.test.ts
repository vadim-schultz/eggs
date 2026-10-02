import { describe, expect, it } from "vitest";

import { halfDozenIconCount } from "./halfDozenIconCount";

describe("halfDozenIconCount", () => {
  it("returns 2 for one dozen", () => {
    expect(halfDozenIconCount(1, "dozen")).toBe(2);
  });

  it("caps at 24 icons for twelve dozen", () => {
    expect(halfDozenIconCount(12, "dozen")).toBe(24);
  });

  it("returns 1 for six pieces", () => {
    expect(halfDozenIconCount(6, "each")).toBe(1);
  });
});
