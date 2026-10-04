import { Box } from "@chakra-ui/react";

import MapView from "@/features/browse/components/MapView";
import { useBackgroundMapState } from "@/features/shell/context/backgroundMap";

export default function BackgroundMapLayer() {
  const {
    center,
    listings,
    selectedId,
    onSelect,
    fitGermany,
    showUserMarker,
    radiusM,
    onUserMarkerClick,
  } = useBackgroundMapState();

  return (
    <Box position="fixed" inset="0" zIndex="0">
      <MapView
        center={center}
        listings={listings}
        selectedId={selectedId}
        onSelect={onSelect}
        fitGermany={fitGermany}
        showUserMarker={showUserMarker}
        radiusM={radiusM}
        onUserMarkerClick={onUserMarkerClick}
      />
    </Box>
  );
}
