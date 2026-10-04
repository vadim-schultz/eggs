import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useCommittedNumber from "./useCommittedNumber";

function setup(value = 12) {
  const onCommit = vi.fn();
  const hook = renderHook(() =>
    useCommittedNumber({ value, min: 1, max: 100, onCommit }),
  );
  return { ...hook, onCommit };
}

describe("useCommittedNumber", () => {
  it("shows the current value until the user types", () => {
    const { result } = setup(12);
    expect(result.current.text).toBe("12");
  });

  it("commits a typed integer", () => {
    const { result, onCommit } = setup();
    act(() => result.current.onTextChange("24"));
    expect(result.current.text).toBe("24");
    act(() => result.current.commit());
    expect(onCommit).toHaveBeenCalledWith(24);
  });

  it("clamps above max and below min", () => {
    const { result, onCommit } = setup();
    act(() => result.current.onTextChange("500"));
    act(() => result.current.commit());
    expect(onCommit).toHaveBeenLastCalledWith(100);
    act(() => result.current.onTextChange("0"));
    act(() => result.current.commit());
    expect(onCommit).toHaveBeenLastCalledWith(1);
  });

  it("reverts on non-numeric or empty input without committing", () => {
    const { result, onCommit } = setup(12);
    act(() => result.current.onTextChange("abc"));
    act(() => result.current.commit());
    expect(onCommit).not.toHaveBeenCalled();
    expect(result.current.text).toBe("12");
    act(() => result.current.onTextChange(""));
    act(() => result.current.commit());
    expect(onCommit).not.toHaveBeenCalled();
    expect(result.current.text).toBe("12");
  });
});
