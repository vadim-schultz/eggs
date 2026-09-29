import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useSession } from "../auth/useSession";
import LocationPicker, {
  type ConfirmedPin,
} from "../components/LocationPicker";
import ListingCard from "../components/ListingCard";
import MapView from "../components/MapView";
import { useGeolocation, type GeoPoint } from "../hooks/useGeolocation";
import { useListingsNear } from "../hooks/useListingsNear";
import { t } from "../i18n/t";

const FALLBACK_CENTER: GeoPoint = { lat: 52.52, lng: 13.405 };
const DEFAULT_RADIUS_M = 15000;
const RADIUS_OPTIONS: { meters: number; labelKey: "home.radius.5km" | "home.radius.15km" | "home.radius.30km" }[] = [
  { meters: 5000, labelKey: "home.radius.5km" },
  { meters: 15000, labelKey: "home.radius.15km" },
  { meters: 30000, labelKey: "home.radius.30km" },
];

function PostCta({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    return (
      <Button asChild>
        <RouterLink to="/post">{t("nav.postListing")}</RouterLink>
      </Button>
    );
  }
  return <Text>{t("auth.signInRequired")}</Text>;
}

export default function Home() {
  const { session } = useSession();
  const { center: geoCenter } = useGeolocation(FALLBACK_CENTER);
  const [manualCenter, setManualCenter] = useState<ConfirmedPin | null>(null);
  const [locationQuery, setLocationQuery] = useState("");
  const [radiusM, setRadiusM] = useState(DEFAULT_RADIUS_M);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const center = manualCenter ?? geoCenter;
  const { listings } = useListingsNear(center, radiusM);

  return (
    <Stack gap="4" p="4">
      <Heading>{t("home.heading")}</Heading>

      <Flex justify="space-between" align="center">
        <PostCta signedIn={Boolean(session)} />
      </Flex>

      <label htmlFor="radius">{t("home.radius.label")}</label>
      <select
        id="radius"
        value={radiusM}
        onChange={(event) => setRadiusM(Number(event.target.value))}
      >
        {RADIUS_OPTIONS.map((option) => (
          <option key={option.meters} value={option.meters}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>

      <Text>{t("home.location.searchInstead")}</Text>
      <LocationPicker
        query={locationQuery}
        onQueryChange={setLocationQuery}
        confirmed={manualCenter}
        onConfirm={setManualCenter}
      />

      <MapView
        center={center}
        listings={listings}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <Stack gap="2">
        {listings.length === 0 && <Text>{t("home.empty")}</Text>}
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            selected={listing.id === selectedId}
            onSelect={setSelectedId}
          />
        ))}
      </Stack>
    </Stack>
  );
}
