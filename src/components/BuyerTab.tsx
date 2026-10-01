import { useState } from "react";
import { Field, NativeSelect, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import AuthButton from "@/features/auth/components/AuthButton";
import { useGeolocation, type GeoPoint } from "../hooks/useGeolocation";
import { useListingsNear } from "../hooks/useListingsNear";
import { t } from "../i18n/t";
import type { ListingNear } from "@/features/listings/types/listing";
import { useAppDialog } from "./AppDialogState";
import { usePublishBackgroundMap } from "./BackgroundMap";
import ListingCard from "./ListingCard";
import LocationPicker, { type ConfirmedPin } from "./LocationPicker";

const FALLBACK_CENTER: GeoPoint = { lat: 52.52, lng: 13.405 };
const DEFAULT_RADIUS_M = 15000;
const RADIUS_OPTIONS: {
  meters: number;
  labelKey: "home.radius.5km" | "home.radius.15km" | "home.radius.30km";
}[] = [
  { meters: 5000, labelKey: "home.radius.5km" },
  { meters: 15000, labelKey: "home.radius.15km" },
  { meters: 30000, labelKey: "home.radius.30km" },
];

function RadiusSelect({
  radiusM,
  onChange,
}: {
  radiusM: number;
  onChange: (radiusM: number) => void;
}) {
  return (
    <Field.Root>
      <Field.Label>{t("home.radius.label")}</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={radiusM}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {RADIUS_OPTIONS.map((option) => (
            <option key={option.meters} value={option.meters}>
              {t(option.labelKey)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}

function ResultsGrid({
  listings,
  selectedId,
  onSelect,
}: {
  listings: ListingNear[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (listings.length === 0) {
    return <Text>{t("home.empty")}</Text>;
  }

  return (
    <SimpleGrid data-testid="results-grid" columns={{ base: 1, sm: 2 }} gap="2">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          selected={listing.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </SimpleGrid>
  );
}

export default function BuyerTab() {
  const { center: geoCenter } = useGeolocation(FALLBACK_CENTER);
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
