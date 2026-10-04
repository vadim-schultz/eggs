import { describe, expect, it } from "vitest";

import { contrastRatio, meetsAA } from "./contrast";
import { ROLE_SWATCH } from "./semantic-tokens/palettes";
import { system } from "./index";

type Mode = "base" | "_dark";

function resolve(path: string, modeKey: Mode): string {
  const token = system.tokens.getByName(path);
  const conditions = token?.extensions.conditions as
    | Record<Mode, string>
    | undefined;
  const raw = conditions?.[modeKey] ?? String(token?.value);
  const ref = /^\{(.+)\}$/.exec(raw);
  return ref ? resolve(ref[1], modeKey) : raw;
}

describe("role contrast", () => {
  const cases = Object.keys(ROLE_SWATCH).flatMap((role) =>
    (["base", "_dark"] as const).map((m) => [role, m] as const),
  );

  it.each(cases)("%s solid/contrast is AA in %s", (role, m) => {
    const solid = resolve(`colors.${role}.solid`, m);
    const contrast = resolve(`colors.${role}.contrast`, m);
    expect(contrastRatio(solid, contrast)).toBeGreaterThanOrEqual(4.5);
  });

  it("rejects an injected low-contrast pair", () => {
    expect(meetsAA("#ffffff", "#f5f5f5")).toBe(false);
    expect(contrastRatio("#ffffff", "#f5f5f5")).toBeLessThan(1.2);
  });
});
