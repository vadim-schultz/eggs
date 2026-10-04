import { expect, it } from "vitest";

import { system } from "./index";

it("keyframes · wiggle, bounce and pop are registered", () => {
  const frames = system._config.theme?.keyframes ?? {};
  expect(Object.keys(frames)).toEqual(
    expect.arrayContaining(["wiggle", "bounce", "pop"]),
  );
});

it("keyframes · unknown keyframe is not registered", () => {
  const frames = system._config.theme?.keyframes ?? {};
  expect(frames).not.toHaveProperty("spin-forever");
});
