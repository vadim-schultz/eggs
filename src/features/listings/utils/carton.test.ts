import { describe, expect, it } from "vitest";
import { cartonPriceCents, isCartonAvailable } from "./carton";

describe("cartonPriceCents", () => {
  it("multiplies per-egg price by carton size", () => {
    expect(cartonPriceCents(35, 6)).toBe(210);
    expect(cartonPriceCents(35, 10)).toBe(350);
  });
  it("rejects a negative per-egg price", () => {
    expect(() => cartonPriceCents(-1, 6)).toThrow();
  });
});

describe("isCartonAvailable", () => {
  it("is true when enough eggs remain", () => {
    expect(isCartonAvailable(10, 10)).toBe(true);
    expect(isCartonAvailable(12, 6)).toBe(true);
  });
  it("is false when too few eggs remain", () => {
    expect(isCartonAvailable(5, 6)).toBe(false);
    expect(isCartonAvailable(0, 10)).toBe(false);
  });
});
