import { useState } from "react";
import { Stack, Text } from "@chakra-ui/react";

import { useAppDialog } from "@/features/shell/context/appDialog";
import { usePublishBackgroundMap } from "@/features/shell/context/backgroundMap";
import AuthButton from "@/features/auth/components/AuthButton";
import {
  RadiusSelect,
  ResultsGrid,
} from "@/features/browse/components/BuyerTab";
import { useGeolocation } from "@/features/browse/hooks/useGeolocation";
import { useListingsNear } from "@/features/browse/hooks/useListingsNear";
import LocationPicker, {
  type ConfirmedPin,
} from "@/features/location/components/LocationPicker";
import { t } from "@/i18n/t";
import { DEFAULT_MAP_CENTER } from "@/lib/geo/constants";

const DEFAULT_RADIUS_M = 15000;

export default function BuyerTab() {
  const { center: geoCenter } = useGeolocation(DEFAULT_MAP_CENTER);
  const [manualCenter, setManualCenter] = useState<ConfirmedPin | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [radiusM, setRadiusM] = useState(DEFAULT_RADIUS_M);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { openDetailDialog } = useAppDialog();

  const center = manualCenter ?? geoCenter;
  const { listings } = useListingsNear(center, radiusM);

  function selectListing(id: string) {
    setSelectedId(id);
    openDetailDialog(id);
  }

  usePublishBackgroundMap({
    center,
    listings,
    selectedId,
    onSelect: selectListing,
  });

  return (
    <Stack gap="4">
      <AuthButton />
      <RadiusSelect radiusM={radiusM} onChange={setRadiusM} />
      <Text>{t("home.location.searchInstead")}</Text>
      <LocationPicker
        query={locationQuery}
        onQueryChange={setLocationQuery}
        confirmed={manualCenter}
        onConfirm={setManualCenter}
      />
      <ResultsGrid
        listings={listings}
        selectedId={selectedId}
        onSelect={selectListing}
      />
    </Stack>
  );
}
