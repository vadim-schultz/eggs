import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, expect, it, vi } from "vitest";

import { useColorMode } from "./color-mode";

const { useThemeMock } = vi.hoisted(() => ({
  useThemeMock: vi.fn(),
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
  useTheme: () => useThemeMock(),
}));

beforeEach(() => {
  useThemeMock.mockReset();
});

it("useColorMode · toggle requests dark theme", () => {
  const setTheme = vi.fn();
  useThemeMock.mockReturnValue({
    resolvedTheme: "light",
    setTheme,
  });

  const { result } = renderHook(() => useColorMode());

  act(() => {
    result.current.toggleColorMode();
  });

  expect(setTheme).toHaveBeenCalledWith("dark");
});

it("useColorMode · forced theme rejects toggle without calling setTheme", () => {
  const setTheme = vi.fn();
  useThemeMock.mockReturnValue({
    resolvedTheme: "light",
    forcedTheme: "dark",
    setTheme,
  });

  const { result } = renderHook(() => useColorMode());

  act(() => {
    result.current.toggleColorMode();
  });

  expect(setTheme).not.toHaveBeenCalled();
});
