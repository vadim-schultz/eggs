import { useEffect } from "react";
import { useMap } from "react-leaflet";

import type { GeoPoint } from "@/features/browse/types/geo";
import { GERMANY_BOUNDS } from "@/lib/geo/constants";

interface RecenterProps {
  center: GeoPoint;
  fitGermany: boolean;
}

export default function Recenter({ center, fitGermany }: RecenterProps) {
  const map = useMap();

  useEffect(() => {
    if (fitGermany) {
      map.fitBounds(GERMANY_BOUNDS);
      return;
    }
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center.lat, center.lng, fitGermany, map]);

  return null;
}
