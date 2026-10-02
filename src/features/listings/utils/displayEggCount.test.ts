import { describe, expect, it } from "vitest";

import { displayEggCount } from "./displayEggCount";

describe("displayEggCount", () => {
  it("returns literal egg count for each unit", () => {
    expect(displayEggCount(3, "each")).toBe(3);
    expect(displayEggCount(100, "each")).toBe(100);
  });

  it("multiplies dozen by twelve and clamps above one hundred", () => {
    expect(displayEggCount(1, "dozen")).toBe(12);
    expect(displayEggCount(9, "dozen")).toBe(100);
    expect(displayEggCount(12, "dozen")).toBe(100);
  });
});
