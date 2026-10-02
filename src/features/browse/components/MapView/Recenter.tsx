import { useEffect } from "react";
import { useMap } from "react-leaflet";

import type { GeoPoint } from "@/features/browse/types/geo";
import { boundsForRadius } from "@/lib/geo/boundsForRadius";
import { GERMANY_BOUNDS } from "@/lib/geo/constants";

interface RecenterProps {
  center: GeoPoint;
  fitGermany: boolean;
  radiusM: number;
}

export default function Recenter({
  center,
  fitGermany,
  radiusM,
}: RecenterProps) {
  const map = useMap();

  useEffect(() => {
    if (fitGermany) {
      map.fitBounds(GERMANY_BOUNDS);
      return;
    }
    map.fitBounds(boundsForRadius(center, radiusM));
  }, [center.lat, center.lng, fitGermany, radiusM, map]);

  return null;
}
