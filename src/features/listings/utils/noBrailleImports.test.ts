import { describe, expect, it } from "vitest";

const sourceModules = import.meta.glob(["/src/**/*.ts", "/src/**/*.tsx"], {
  query: "?raw",
  import: "default",
  eager: true,
});

function productionSources(): [string, string][] {
  return Object.entries(sourceModules).filter(
    ([path]) => !path.includes(".test."),
  ) as [string, string][];
}

describe("braille retirement", () => {
  it("has no imports of renderEggQuantityBraille under src", () => {
    const offenders = productionSources()
      .filter(([, text]) => text.includes("renderEggQuantityBraille"))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});
