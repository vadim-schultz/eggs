import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAsyncAction } from "./useAsyncAction";

describe("useAsyncAction", () => {
  it("sets busy during the action and clears busy with error false on ok", async () => {
    let resolveAction: (value: { ok: true }) => void = () => {};
    const action = () =>
      new Promise<{ ok: true }>((resolve) => {
        resolveAction = resolve;
      });

    const { result } = renderHook(() => useAsyncAction());

    expect(result.current.busy).toBe(false);
    expect(result.current.error).toBe(false);

    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.run(action);
    });

    expect(result.current.busy).toBe(true);
    expect(result.current.error).toBe(false);

    await act(async () => {
      resolveAction({ ok: true });
      await pending;
    });

    expect(result.current.busy).toBe(false);
    expect(result.current.error).toBe(false);
  });

  it("sets error true when the action returns ok false", async () => {
    const { result } = renderHook(() => useAsyncAction());

    await act(async () => {
      await result.current.run(async () => ({ ok: false }));
    });

    expect(result.current.error).toBe(true);
    expect(result.current.busy).toBe(false);
  });
});
