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
