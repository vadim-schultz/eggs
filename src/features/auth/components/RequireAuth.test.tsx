import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "@/features/auth/components/RequireAuth";

const { useSessionMock, toasterCreateMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  toasterCreateMock: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));

vi.mock("@/components/ui/toaster", () => ({
  toaster: { create: toasterCreateMock },
}));

function renderGuarded(initialPath: string) {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route
          path="/post"
          element={
            <RequireAuth>
              <div>protected</div>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("RequireAuth", () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    toasterCreateMock.mockReset();
  });

  it("renders children when a session exists", () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "user-1" } },
      loading: false,
    });

    renderGuarded("/post");

    expect(screen.getByText("protected")).toBeInTheDocument();
  });

  it('redirects to "/" when no session exists', () => {
    useSessionMock.mockReturnValue({ session: null, loading: false });

    renderGuarded("/post");

    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
