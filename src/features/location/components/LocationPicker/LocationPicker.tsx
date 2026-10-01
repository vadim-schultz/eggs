import { Field, Input, Stack, Text } from "@chakra-ui/react";

import CandidateList from "./CandidateList";
import ManualPinFallback from "./ManualPinFallback";
import { useSearchCandidates } from "@/features/location/hooks/useSearchCandidates";
import type { ConfirmedPin } from "@/features/location/types/place";
import { t } from "@/i18n/t";

interface LocationPickerProps {
  query: string;
  onQueryChange: (query: string) => void;
  confirmed: ConfirmedPin | null;
  onConfirm: (pin: ConfirmedPin) => void;
}

/** Search or manually enter a location pin for listing and browse flows. */
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
      <Field.Root>
        <Field.Label>{t("post.location.label")}</Field.Label>
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </Field.Root>
      {searching && <Text>{t("post.location.searching")}</Text>}
      {candidates.length > 0 && (
        <CandidateList candidates={candidates} onConfirm={onConfirm} />
      )}
      {showManualPin && <ManualPinFallback onConfirm={onConfirm} />}
      {confirmed && <Text>{t("post.location.confirmed")}</Text>}
    </Stack>
  );
}
