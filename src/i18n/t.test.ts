import { describe, expect, it } from "vitest";

import { t } from "@/i18n/t";

describe("t", () => {
  it("returns the German string for a known key", () => {
    expect(t("app.title")).toBe("eggs");
  });
});
