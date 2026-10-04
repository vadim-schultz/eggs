import { beforeEach, describe, expect, it, vi } from "vitest";

import { signInWithGoogle } from "./signInWithGoogle";

const { signInWithOAuthMock } = vi.hoisted(() => ({
  signInWithOAuthMock: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { signInWithOAuth: signInWithOAuthMock } },
}));

describe("signInWithGoogle", () => {
  beforeEach(() => signInWithOAuthMock.mockReset());

  it("starts the google OAuth flow redirecting to the origin", async () => {
    signInWithOAuthMock.mockResolvedValue({ data: {}, error: null });

    await signInWithGoogle();

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  });

  it("does not start any other provider", async () => {
    await signInWithGoogle();

    expect(signInWithOAuthMock).toHaveBeenCalledTimes(1);
    expect(signInWithOAuthMock.mock.calls[0][0].provider).toBe("google");
  });
});
