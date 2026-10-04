import { expect, it } from "vitest";

import { system } from "./index";

const UNREGISTERED_SEMANTIC_TOKEN = "colors.not.a.real.token";

function semanticBase(path: string): unknown {
  const token = system.tokens.getByName(path);
  const conditions = token?.extensions.conditions;
  if (!conditions || typeof conditions !== "object") {
    return undefined;
  }
  return conditions.base;
}

it("theme · Easter blush.500 is registered", () => {
  expect(system.token("colors.blush.500")).toBeTruthy();
});

it("theme · semantic fg and nav.bg are registered", () => {
  expect(semanticBase("colors.fg")).toBeTruthy();
  expect(semanticBase("colors.nav.bg")).toBeTruthy();
});

it("theme · rejects unregistered semantic token lookup", () => {
  expect(system.tokens.getByName(UNREGISTERED_SEMANTIC_TOKEN)).toBeUndefined();
  expect(system.token(UNREGISTERED_SEMANTIC_TOKEN)).toBeUndefined();
});

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

it("theme · every Easter swatch has full 50-950 stops", () => {
  for (const stop of STOPS) {
    expect(system.token(`colors.coral.${stop}`)).toBeTruthy();
  }
});

it("theme · role slots are registered", () => {
  expect(semanticBase("colors.primary.solid")).toBeTruthy();
  expect(semanticBase("colors.danger.contrast")).toBeTruthy();
});

it("theme · rejects an unregistered ramp stop", () => {
  expect(system.token("colors.coral.55")).toBeUndefined();
});

it("theme · default colorPalette is primary via globalCss", () => {
  const css = system.css({ colorPalette: "primary" });
  expect(css["--chakra-colors-color-palette-solid"]).toBe(
    "var(--chakra-colors-primary-solid)",
  );
  expect(system.css({ colorPalette: "nope" })).not.toEqual(css);
});

it("theme · shadows.sticker is registered", () => {
  expect(system.token("shadows.sticker")).toBeTruthy();
});

it("theme · rejects an unregistered shadow token", () => {
  expect(system.token("shadows.not-a-shadow")).toBeUndefined();
});

type Loose = Record<string, Record<string, unknown> | undefined>;
const recipes = (system._config.theme?.recipes ?? {}) as unknown as Loose;
const slotRecipes = (system._config.theme?.slotRecipes ??
  {}) as unknown as Loose;

it("theme · playful control recipes are registered", () => {
  expect(recipes.button?.base).toMatchObject({
    borderRadius: "full",
    fontWeight: "bold",
  });
  expect(recipes.badge?.base).toMatchObject({ borderRadius: "full" });
  const card = slotRecipes.card?.base as Loose | undefined;
  expect(card?.root).toMatchObject({
    borderWidth: "2px",
    boxShadow: "sticker",
  });
  const slider = slotRecipes.slider?.base as Loose | undefined;
  expect(slider?.thumb).toMatchObject({ borderRadius: "full" });
  const combobox = slotRecipes.combobox?.base as Loose | undefined;
  expect(combobox?.content).toMatchObject({ borderRadius: "2xl" });
});

it("theme · rejects an unregistered recipe name", () => {
  expect(recipes.nonexistent).toBeUndefined();
  expect(slotRecipes.nonexistent).toBeUndefined();
});
