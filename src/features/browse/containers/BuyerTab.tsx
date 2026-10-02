import { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";

import { useAppDialog } from "@/features/shell/context/appDialog";
import { usePublishBackgroundMap } from "@/features/shell/context/backgroundMap";
import AuthButton from "@/features/auth/components/AuthButton";
import {
  BuyerSearchRows,
  ResultsGrid,
} from "@/features/browse/components/BuyerTab";
import { useGeolocation } from "@/features/browse/hooks/useGeolocation";
import { useListingsNear } from "@/features/browse/hooks/useListingsNear";
import type { ConfirmedPin } from "@/features/location/types/place";
import { DEFAULT_MAP_CENTER } from "@/lib/geo/constants";

const DEFAULT_RADIUS_M = 15000;

export default function BuyerTab() {
  const {
    center: geoCenter,
    geoGranted,
    requestLocation,
  } = useGeolocation(DEFAULT_MAP_CENTER);
  const [manualCenter, setManualCenter] = useState<ConfirmedPin | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [radiusM, setRadiusM] = useState(DEFAULT_RADIUS_M);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { openDetailDialog } = useAppDialog();

  useEffect(() => {
    if (geoGranted) {
      setManualCenter(null);
    }
  }, [geoGranted, geoCenter.lat, geoCenter.lng]);

  const center = manualCenter ?? geoCenter;
  const fitGermany = !manualCenter && !geoGranted;
  const showUserMarker = Boolean(manualCenter) || geoGranted;
  const { listings } = useListingsNear(center, radiusM);

  function selectListing(id: string) {
    setSelectedId(id);
    openDetailDialog(id);
  }

  function handleRequestGeolocation() {
    setManualCenter(null);
    requestLocation();
  }

  usePublishBackgroundMap({
    center,
    listings,
    selectedId,
    onSelect: selectListing,
    fitGermany,
    showUserMarker,
  });

  return (
    <Stack gap="4">
      <AuthButton />
      <BuyerSearchRows
        radiusM={radiusM}
        onRadiusChange={setRadiusM}
        locationQuery={locationQuery}
        onLocationQueryChange={setLocationQuery}
        manualCenter={manualCenter}
        onConfirmLocation={setManualCenter}
        onRequestGeolocation={handleRequestGeolocation}
      />
      <ResultsGrid
        listings={listings}
        selectedId={selectedId}
        onSelect={selectListing}
      />
    </Stack>
  );
}
