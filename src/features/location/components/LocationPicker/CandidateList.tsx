import { Button, Stack } from "@chakra-ui/react";

import type {
  ConfirmedPin,
  PlaceCandidate,
} from "@/features/location/types/place";

interface CandidateListProps {
  candidates: PlaceCandidate[];
  onConfirm: (pin: ConfirmedPin) => void;
}

/** Render selectable geocode result buttons. */
export default function CandidateList({
  candidates,
  onConfirm,
}: CandidateListProps) {
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
