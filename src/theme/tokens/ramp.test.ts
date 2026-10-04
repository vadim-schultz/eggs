import { describe, expect, it } from "vitest";

import { RAMP_STOPS, ramp } from "./ramp";

describe("ramp", () => {
  it("returns every stop 50..950 with the anchor at 500", () => {
    const result = ramp("#F0806C");
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(RAMP_STOPS.map(String)),
    );
    expect(result[500].value).toBe("#F0806C");
    expect(result.DEFAULT.value).toBe("#F0806C");
  });

  it("lightens towards 50 and darkens towards 950", () => {
    const result = ramp("#F0806C");
    expect(result[50].value > result[500].value).toBe(true);
    expect(result[950].value < result[500].value).toBe(true);
  });

  it("rejects a non-hex anchor", () => {
    expect(() => ramp("coral")).toThrow();
  });
});
