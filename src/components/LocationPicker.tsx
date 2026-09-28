import { useEffect, useState } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";

import { t } from "../i18n/t";
import { searchPlace, type PlaceCandidate } from "../lib/geocode";

const SEARCH_DEBOUNCE_MS = 500;

export interface ConfirmedPin {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  query: string;
  onQueryChange: (query: string) => void;
  confirmed: ConfirmedPin | null;
  onConfirm: (pin: ConfirmedPin) => void;
}

function useSearchCandidates(query: string) {
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setCandidates([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      searchPlace(query).then((results) => {
        setCandidates(results);
        setSearching(false);
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  return { candidates, searching };
}

function CandidateList({
  candidates,
  onConfirm,
}: {
  candidates: PlaceCandidate[];
  onConfirm: (pin: ConfirmedPin) => void;
}) {
  return (
    <Stack gap="1">
      {candidates.map((candidate) => (
        <Button
          key={`${candidate.lat},${candidate.lng}`}
          variant="outline"
          onClick={() => onConfirm({ lat: candidate.lat, lng: candidate.lng })}
        >
          {candidate.label}
        </Button>
      ))}
    </Stack>
  );
}

function ManualPinFallback({
  onConfirm,
}: {
  onConfirm: (pin: ConfirmedPin) => void;
}) {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  return (
    <Box>
      <Text>{t("post.location.noResults")}</Text>
      <label htmlFor="manual-lat">{t("post.location.manualLat.label")}</label>
      <Input
        id="manual-lat"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <label htmlFor="manual-lng">{t("post.location.manualLng.label")}</label>
      <Input
        id="manual-lng"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <Button
        onClick={() =>
          onConfirm({ lat: parseFloat(lat), lng: parseFloat(lng) })
        }
      >
        {t("post.location.useManualPin")}
      </Button>
    </Box>
  );
}

export default function LocationPicker({
  query,
  onQueryChange,
  confirmed,
  onConfirm,
}: LocationPickerProps) {
  const { candidates, searching } = useSearchCandidates(query);
  const showManualPin =
    !searching && query.trim().length > 0 && candidates.length === 0;

  return (
    <Stack gap="2">
      <label htmlFor="location-query">{t("post.location.label")}</label>
      <Input
        id="location-query"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {searching && <Text>{t("post.location.searching")}</Text>}
      {candidates.length > 0 && (
        <CandidateList candidates={candidates} onConfirm={onConfirm} />
      )}
      {showManualPin && <ManualPinFallback onConfirm={onConfirm} />}
      {confirmed && <Text>{t("post.location.confirmed")}</Text>}
    </Stack>
  );
}
