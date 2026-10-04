import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { GeoPoint } from "@/features/browse/types/geo";
import type { ListingNear } from "@/features/listings/types/listing";
import { DEFAULT_MAP_CENTER } from "@/lib/geo/constants";

export interface BackgroundMapState {
  center: GeoPoint;
  listings: ListingNear[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  fitGermany: boolean;
  showUserMarker: boolean;
  radiusM: number;
  onUserMarkerClick: () => void;
}

const FALLBACK_STATE: BackgroundMapState = {
  center: DEFAULT_MAP_CENTER,
  listings: [],
  selectedId: null,
  onSelect: () => {},
  fitGermany: true,
  showUserMarker: false,
  radiusM: 5000,
  onUserMarkerClick: () => {},
};

const BackgroundMapStateContext =
  createContext<BackgroundMapState>(FALLBACK_STATE);
const SetBackgroundMapContext = createContext<
  (state: BackgroundMapState) => void
>(() => {});

export function BackgroundMapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(FALLBACK_STATE);

  return (
    <SetBackgroundMapContext.Provider value={setState}>
      <BackgroundMapStateContext.Provider value={state}>
        {children}
      </BackgroundMapStateContext.Provider>
    </SetBackgroundMapContext.Provider>
  );
}

export function useBackgroundMapState(): BackgroundMapState {
  return useContext(BackgroundMapStateContext);
}

/** Lets a route publish the data AppShell's background map should show. */
export function usePublishBackgroundMap(state: BackgroundMapState): void {
  const setState = useContext(SetBackgroundMapContext);
  const {
    listings,
    selectedId,
    onSelect,
    fitGermany,
    showUserMarker,
    radiusM,
    onUserMarkerClick,
  } = state;
  const lat = state.center.lat;
  const lng = state.center.lng;

  useEffect(() => {
    setState({
      center: { lat, lng },
      listings,
      selectedId,
      onSelect,
      fitGermany,
      showUserMarker,
      radiusM,
      onUserMarkerClick,
    });
  }, [
    setState,
    lat,
    lng,
    listings,
    selectedId,
    onSelect,
    fitGermany,
    showUserMarker,
    radiusM,
    onUserMarkerClick,
  ]);
}
