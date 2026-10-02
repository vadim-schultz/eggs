import { expect, it } from "vitest";

import triggerSource from "./AppShellMenuTrigger.tsx?raw";

it("AppShellMenuTrigger · does not hardcode bg white", () => {
  expect(triggerSource).not.toMatch(/\bbg="white"/);
});
