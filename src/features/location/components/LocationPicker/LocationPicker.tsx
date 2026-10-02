import { Stack } from "@chakra-ui/react";

import PlaceCombobox from "@/features/location/components/PlaceCombobox";
import { useSearchCandidates } from "@/features/location/hooks/useSearchCandidates";
import type { ConfirmedPin } from "@/features/location/types/place";
import { t } from "@/i18n/t";

import KeyValueRow from "@/components/ui/KeyValueRow";

interface LocationPickerProps {
  query: string;
  onQueryChange: (query: string) => void;
  confirmed: ConfirmedPin | null;
  onConfirm: (pin: ConfirmedPin) => void;
  onRequestGeolocation?: () => void;
  /** When true, omit the Ort label row (parent supplies KeyValueRow). */
  embedInRow?: boolean;
}

function confirmFromCandidate(candidate: {
  label: string;
  lat: number;
  lng: number;
}): ConfirmedPin {
  return { lat: candidate.lat, lng: candidate.lng };
}

/** Ort search via combobox (and optional geolocate trigger). */
export default function LocationPicker({
  query,
  onQueryChange,
  onConfirm,
  onRequestGeolocation,
  embedInRow = false,
}: LocationPickerProps) {
  const { candidates, searching } = useSearchCandidates(query);

  const combobox = (
    <PlaceCombobox
      query={query}
      onQueryChange={onQueryChange}
      candidates={candidates}
      searching={searching}
      onSelect={(candidate) => onConfirm(confirmFromCandidate(candidate))}
      onRequestGeolocation={onRequestGeolocation}
    />
  );

  if (embedInRow) {
    return combobox;
  }

  return (
    <Stack gap="2">
      <KeyValueRow label={t("post.location.shortLabel")}>
        {combobox}
      </KeyValueRow>
    </Stack>
  );
}
