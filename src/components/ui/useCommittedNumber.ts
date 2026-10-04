import { useState } from "react";

export interface UseCommittedNumberOptions {
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
}

/** Draft text for a numeric input; commits a clamped integer, else reverts. */
export default function useCommittedNumber({
  value,
  min,
  max,
  onCommit,
}: UseCommittedNumberOptions) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    if (draft !== null && /^\s*-?\d+\s*$/.test(draft)) {
      onCommit(Math.min(max, Math.max(min, Number.parseInt(draft, 10))));
    }
    setDraft(null);
  };

  return {
    text: draft ?? String(value),
    onTextChange: setDraft,
    commit,
  };
}
