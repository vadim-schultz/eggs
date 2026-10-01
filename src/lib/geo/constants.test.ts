import { describe, expect, it } from "vitest";

import { DEFAULT_MAP_CENTER } from "./constants";

describe("constants", () => {
  it("DEFAULT_MAP_CENTER matches Berlin coordinates", () => {
    expect(DEFAULT_MAP_CENTER).toEqual({ lat: 52.52, lng: 13.405 });
  });
});
