import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import App from "./App";

const { getSessionMock, onAuthStateChangeMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
}));

vi.mock("./lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

function renderAt(path: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("App", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('renders Home at "/"', async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    renderAt("/");

    expect(
      await screen.findByRole("heading", {
        name: "Kommt in einem späteren Kapitel",
      }),
    ).toBeInTheDocument();
  });

  it('redirects "/post" to Home when signed out', async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    renderAt("/post");

    expect(
      await screen.findByRole("heading", {
        name: "Kommt in einem späteren Kapitel",
      }),
    ).toBeInTheDocument();
  });

  it('renders the PostListing form at "/post" when signed in', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
    });

    renderAt("/post");

    expect(
      await screen.findByRole("heading", { name: "Neues Angebot" }),
    ).toBeInTheDocument();
  });
});
