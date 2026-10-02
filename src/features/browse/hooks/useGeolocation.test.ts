import { act } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { germanyCenter } from "@/lib/geo/constants";

import { useGeolocation } from "./useGeolocation";

const FALLBACK = germanyCenter();

function stubGeolocation(geolocation: Geolocation) {
  Object.defineProperty(globalThis.navigator, "geolocation", {
    value: geolocation,
    configurable: true,
  });
}

describe("useGeolocation", () => {
  afterEach(() => {
    Object.defineProperty(globalThis.navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
  });

  it("resolves to the browser position when granted", async () => {
    stubGeolocation({
      getCurrentPosition: (success: PositionCallback) => {
        success({
          coords: { latitude: 48.1, longitude: 11.6 },
        } as GeolocationPosition);
      },
    } as unknown as Geolocation);

    const { result } = renderHook(() => useGeolocation(FALLBACK));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.center).toEqual({ lat: 48.1, lng: 11.6 });
    expect(result.current.geoGranted).toBe(true);
  });

  it("resolves to the fallback center when denied", async () => {
    stubGeolocation({
      getCurrentPosition: (
        _success: PositionCallback,
        error?: PositionErrorCallback,
      ) => {
        error?.({ code: 1 } as GeolocationPositionError);
      },
    } as unknown as Geolocation);

    const { result } = renderHook(() => useGeolocation(FALLBACK));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.center).toEqual(FALLBACK);
    expect(result.current.geoGranted).toBe(false);
  });

  it("requestLocation re-invokes getCurrentPosition", async () => {
    let calls = 0;
    stubGeolocation({
      getCurrentPosition: (success: PositionCallback) => {
        calls += 1;
        success({
          coords: { latitude: 50, longitude: 10 },
        } as GeolocationPosition);
      },
    } as unknown as Geolocation);

    const { result } = renderHook(() => useGeolocation(FALLBACK));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(calls).toBe(1);

    act(() => {
      result.current.requestLocation();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(calls).toBe(2);
  });
});
