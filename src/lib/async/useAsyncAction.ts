import { useState } from "react";

type AsyncActionResult = { ok: true } | { ok: false };

export function useAsyncAction(): {
  busy: boolean;
  error: boolean;
  run: (action: () => Promise<AsyncActionResult>) => Promise<void>;
  resetError: () => void;
} {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function run(action: () => Promise<AsyncActionResult>): Promise<void> {
    setBusy(true);
    setError(false);
    try {
      const result = await action();
      if (!result.ok) setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  function resetError(): void {
    setError(false);
  }

  return { busy, error, run, resetError };
}
