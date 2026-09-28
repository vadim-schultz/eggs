import { describe, expect, it } from "vitest";

import { getSupabaseEnv } from "./env";

describe("getSupabaseEnv", () => {
  it("throws when VITE_SUPABASE_URL is missing", () => {
    expect(() =>
      getSupabaseEnv({ VITE_SUPABASE_ANON_KEY: "anon-key" }),
    ).toThrow(/VITE_SUPABASE_URL/);
  });

  it("throws when VITE_SUPABASE_ANON_KEY is missing", () => {
    expect(() =>
      getSupabaseEnv({ VITE_SUPABASE_URL: "https://example.supabase.co" }),
    ).toThrow(/VITE_SUPABASE_ANON_KEY/);
  });

  it("returns both values when present", () => {
    expect(
      getSupabaseEnv({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_ANON_KEY: "anon-key",
      }),
    ).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
  });
});
