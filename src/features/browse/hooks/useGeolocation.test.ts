import { afterEach, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useGeolocation } from "./useGeolocation";

const FALLBACK = { lat: 52.52, lng: 13.405 };

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
  });
});
