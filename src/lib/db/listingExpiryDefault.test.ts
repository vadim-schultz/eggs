import { describe, expect, it } from "vitest";

const expiryMigrationModules = import.meta.glob(
  "/supabase/migrations/*listing_expiry_24h*.sql",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

const sourceModules = import.meta.glob(["/src/**/*.ts", "/src/**/*.tsx"], {
  query: "?raw",
  import: "default",
  eager: true,
});

const THREE_DAY_INSERT_DEFAULT =
  /3\s*days.*default|default.*\(now\(\)\s*\+\s*interval\s*'3 days'\)/i;

function productionSources(): [string, string][] {
  return Object.entries(sourceModules).filter(
    ([path]) => !path.includes(".test."),
  ) as [string, string][];
}

describe("listing expiry default", () => {
  it("migration sets expires_at default to 24 hours", () => {
    const entries = Object.entries(expiryMigrationModules);
    expect(entries.length).toBeGreaterThan(0);
    const sql = entries.map(([, text]) => text as string).join("\n");
    expect(sql).toMatch(/24 hours/i);
    expect(sql).toMatch(
      /alter table listing[\s\S]*alter column expires_at set default/i,
    );
  });

  it("application source does not claim 3 days as insert default for new listings", () => {
    const offenders = productionSources()
      .filter(([, text]) => THREE_DAY_INSERT_DEFAULT.test(text))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
  });
});
