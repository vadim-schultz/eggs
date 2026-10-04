import { expect, it } from "vitest";

import { floatingSurface } from "./floatingSurface";

it("floatingSurface · uses semantic nav and brand tokens", () => {
  expect(floatingSurface.bg).toBe("nav.bg");
  expect(floatingSurface.borderColor).toBe("nav.border");
  expect(floatingSurface.color).toBe("brand.mark");
});

it("floatingSurface · does not hardcode light-only surface colours", () => {
  expect(floatingSurface.bg).not.toBe("white");
  expect(floatingSurface.borderColor).not.toMatch(/^gray\./);
});

it("floatingSurface · uses the sticker shadow token and a thick border", () => {
  expect(floatingSurface.boxShadow).toBe("sticker");
  expect(floatingSurface.borderWidth).toBe("2px");
});
