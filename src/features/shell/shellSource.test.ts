import { expect, it } from "vitest";

const sources = import.meta.glob<string>(
  ["./**/*.{ts,tsx}", "!./**/*.test.{ts,tsx}"],
  { query: "?raw", import: "default", eager: true },
);

const HARDCODED_COLOUR =
  /["'`](white|black|gray\.[\w.]+|#[0-9a-fA-F]{3,8})["'`]/;

it("shell · scans shell source files", () => {
  expect(Object.keys(sources).length).toBeGreaterThan(3);
});

it("shell · no hardcoded white, gray.* or #hex colours", () => {
  for (const [file, source] of Object.entries(sources)) {
    expect(source, file).not.toMatch(HARDCODED_COLOUR);
  }
});

it("shell · panel and dialog consume floatingSurface", () => {
  const panel = sources["./components/AppShell/AppShellPanel.tsx"];
  const dialog = sources["./components/AppDialog/AppDialog.tsx"];
  expect(panel).toContain("floatingSurface");
  expect(dialog).toContain("floatingSurface");
});

it("shell · role tabs use the secondary palette", () => {
  expect(sources["./components/RoleTabs.tsx"]).toContain(
    'colorPalette="secondary"',
  );
});
