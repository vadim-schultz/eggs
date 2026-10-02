import { describe, expect, it } from "vitest";

import {
  DEFAULT_MAP_CENTER,
  GERMANY_BOUNDS,
  germanyCenter,
} from "./constants";

describe("constants", () => {
  it("germanyCenter lies within GERMANY_BOUNDS", () => {
    const center = germanyCenter();
    const [[south, west], [north, east]] = GERMANY_BOUNDS;
    expect(center.lat).toBeGreaterThan(south);
    expect(center.lat).toBeLessThan(north);
    expect(center.lng).toBeGreaterThan(west);
    expect(center.lng).toBeLessThan(east);
  });

  it("DEFAULT_MAP_CENTER matches germanyCenter", () => {
    expect(DEFAULT_MAP_CENTER).toEqual(germanyCenter());
  });
});
