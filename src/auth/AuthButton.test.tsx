import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import AuthButton from "./AuthButton";

function renderButton() {
  render(
    <ChakraProvider value={defaultSystem}>
      <AuthButton />
    </ChakraProvider>,
  );
}

const { useSessionMock, signOutMock, signInWithOAuthMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  signOutMock: vi.fn(),
  signInWithOAuthMock: vi.fn(),
}));

vi.mock("./useSession", () => ({
  useSession: useSessionMock,
}));

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: signOutMock,
      signInWithOAuth: signInWithOAuthMock,
    },
  },
}));

describe("AuthButton", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    signOutMock.mockReset();
    signInWithOAuthMock.mockReset();
  });

  it('shows "Sign in with Google" when signed out', () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderButton();

    expect(
      screen.getByRole("button", { name: "Mit Google anmelden" }),
    ).toBeInTheDocument();
  });

  it('shows "Sign out" and calls supabase.auth.signOut on click', () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "user-1" } },
      loading: false,
    });

    renderButton();
    fireEvent.click(screen.getByRole("button", { name: "Abmelden" }));

    expect(signOutMock).toHaveBeenCalled();
  });
});
