import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSession } from "@/features/auth/hooks/useSession";

const { getSessionMock, onAuthStateChangeMock, unsubscribeMock } = vi.hoisted(
  () => ({
    getSessionMock: vi.fn(),
    onAuthStateChangeMock: vi.fn(),
    unsubscribeMock: vi.fn(),
  }),
);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  },
}));

describe("useSession", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    unsubscribeMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });
  });

  it("starts with loading true and no session", () => {
    getSessionMock.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useSession());

    expect(result.current).toEqual({ session: null, loading: true });
  });

  it("reflects a session after onAuthStateChange fires SIGNED_IN", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });
    let authCallback: (event: string, session: unknown) => void = () => {};
    onAuthStateChangeMock.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: unsubscribeMock } } };
    });

    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const fakeSession = { user: { id: "user-1" } };
    act(() => {
      authCallback("SIGNED_IN", fakeSession);
    });

    expect(result.current.session).toEqual(fakeSession);
  });

  it("clears the session after SIGNED_OUT", async () => {
    const fakeSession = { user: { id: "user-1" } };
    getSessionMock.mockResolvedValue({ data: { session: fakeSession } });
    let authCallback: (event: string, session: unknown) => void = () => {};
    onAuthStateChangeMock.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: unsubscribeMock } } };
    });

    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.session).toEqual(fakeSession));

    act(() => {
      authCallback("SIGNED_OUT", null);
    });

    expect(result.current.session).toBeNull();
  });
});
