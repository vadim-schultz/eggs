import { describe, expect, it } from "vitest";

import { boundsForRadius } from "./boundsForRadius";

const METERS_PER_DEGREE_LAT = 111_320;

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const earthRadiusM = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusM * Math.asin(Math.sqrt(h));
}

describe("boundsForRadius", () => {
  it("returns SW/NE corners ~10 km apart for 5000 m half-width", () => {
    const center = { lat: 52.52, lng: 13.405 };
    const [[south, west], [north, east]] = boundsForRadius(center, 5000);

    const northSouthSpanM = (north - south) * METERS_PER_DEGREE_LAT;
    expect(northSouthSpanM).toBeGreaterThan(9_900);
    expect(northSouthSpanM).toBeLessThan(10_100);

    const metersPerDegreeLng =
      METERS_PER_DEGREE_LAT * Math.cos((center.lat * Math.PI) / 180);
    const eastWestSpanM = (east - west) * metersPerDegreeLng;
    expect(eastWestSpanM).toBeGreaterThan(9_900);
    expect(eastWestSpanM).toBeLessThan(10_100);

    const diagonalM = haversineMeters(
      { lat: south, lng: west },
      { lat: north, lng: east },
    );
    expect(diagonalM).toBeGreaterThan(13_900);
    expect(diagonalM).toBeLessThan(14_200);
  });
});
