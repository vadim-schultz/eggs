import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fitBounds = vi.fn();

vi.mock("react-leaflet", () => ({
  useMap: () => ({
    fitBounds,
    getZoom: () => 12,
    setView: vi.fn(),
  }),
}));

import { boundsForRadius } from "@/lib/geo/boundsForRadius";
import { GERMANY_BOUNDS } from "@/lib/geo/constants";

import Recenter from "./Recenter";

describe("Recenter", () => {
  beforeEach(() => {
    fitBounds.mockClear();
  });

  it("when fitGermany, does not use radius bounds", () => {
    const center = { lat: 52.52, lng: 13.405 };
    const radiusBounds = boundsForRadius(center, 5000);

    render(<Recenter center={center} fitGermany radiusM={5000} />);

    expect(fitBounds).toHaveBeenCalledTimes(1);
    expect(fitBounds).toHaveBeenCalledWith(GERMANY_BOUNDS);
    expect(fitBounds).not.toHaveBeenCalledWith(radiusBounds);
  });
});
