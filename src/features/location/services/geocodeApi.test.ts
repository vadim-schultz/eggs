import { afterEach, describe, expect, it, vi } from "vitest";

import { reverseGeocode, searchPlace } from "./geocodeApi";

describe("geocodeApi", () => {
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

  it("reverse geocodes a point to a labelled candidate", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ display_name: "Berlin, Germany" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await reverseGeocode({ lat: 52.52, lng: 13.405 });

    expect(result).toEqual({
      label: "Berlin, Germany",
      lat: 52.52,
      lng: 13.405,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse"),
    );
  });

  it("returns null when reverse geocoding fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    expect(await reverseGeocode({ lat: 1, lng: 2 })).toBeNull();
  });
});
