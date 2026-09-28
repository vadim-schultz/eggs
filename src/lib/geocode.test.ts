import { afterEach, describe, expect, it, vi } from "vitest";

import { searchPlace } from "./geocode";

describe("searchPlace", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps a Nominatim result to {label, lat, lng}", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { display_name: "Berlin, Germany", lat: "52.52", lon: "13.405" },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchPlace("Berlin");

    expect(results).toEqual([
      { label: "Berlin, Germany", lat: 52.52, lng: 13.405 },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/search"),
    );
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("q=Berlin"));
  });

  it("returns an empty array on no results", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);

    const results = await searchPlace("a place that does not exist anywhere");

    expect(results).toEqual([]);
  });
});
