import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import App from "./App";

const { getSessionMock, onAuthStateChangeMock, rpcMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
  rpcMock: vi.fn(),
}));

vi.mock("./lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
    rpc: rpcMock,
  },
}));

vi.mock("./components/MapView", () => ({
  default: () => null,
}));

function renderAt(path: string) {
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ChakraProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Menü" }));
}

describe("App", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ data: [], error: null });
    Object.defineProperty(globalThis.navigator, "geolocation", {
      value: {
        getCurrentPosition: (
          _success: PositionCallback,
          error?: PositionErrorCallback,
        ) => error?.({ code: 1 } as GeolocationPositionError),
      },
      configurable: true,
    });
  });

  it('renders Home at "/"', async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    renderAt("/");

    expect(
      await screen.findByRole("heading", { name: "Eier in deiner Nähe" }),
    ).toBeInTheDocument();
  });

  it('redirects "/post" to Home when signed out', async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });

    renderAt("/post");

    expect(
      await screen.findByRole("heading", { name: "Eier in deiner Nähe" }),
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
