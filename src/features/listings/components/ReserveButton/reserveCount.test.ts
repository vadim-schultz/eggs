import { describe, expect, it } from "vitest";

import { isReserveCountValid } from "./reserveCount";

describe("isReserveCountValid", () => {
  it("accepts counts from 1 through listing max", () => {
    expect(isReserveCountValid(1, 12)).toBe(true);
    expect(isReserveCountValid(12, 12)).toBe(true);
  });

  it("rejects zero and counts above listing max", () => {
    expect(isReserveCountValid(0, 12)).toBe(false);
    expect(isReserveCountValid(13, 12)).toBe(false);
  });
});
