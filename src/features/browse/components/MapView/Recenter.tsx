import { useEffect } from "react";
import { useMap } from "react-leaflet";

import type { GeoPoint } from "@/features/browse/types/geo";

export default function Recenter({ center }: { center: GeoPoint }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map]);

  return null;
}
