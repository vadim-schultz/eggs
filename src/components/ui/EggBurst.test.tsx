import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { system } from "@/theme";

import EggBurst from "./EggBurst";

function mockMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduce ? false : query.includes("no-preference"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function renderBurst(active: boolean, count = 5) {
  return render(
    <ChakraProvider value={system}>
      <EggBurst active={active} count={count} />
    </ChakraProvider>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("EggBurst", () => {
  it("renders N eggs with distinct palette colours when active", () => {
    mockMotion(false);
    renderBurst(true, 5);
    const eggs = screen.getAllByTestId("egg-burst-egg");
    expect(eggs).toHaveLength(5);
    const colors = eggs.map((egg) => egg.getAttribute("data-egg-color"));
    expect(new Set(colors).size).toBe(5);
    expect(colors[0]).toMatch(/^egg\./);
  });

  it("renders nothing when inactive", () => {
    mockMotion(false);
    renderBurst(false);
    expect(screen.queryByTestId("egg-burst")).not.toBeInTheDocument();
  });

  it("renders nothing under reduced motion", () => {
    mockMotion(true);
    renderBurst(true);
    expect(screen.queryByTestId("egg-burst")).not.toBeInTheDocument();
  });
});
