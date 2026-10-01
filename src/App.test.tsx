import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import App from "./App";

const { useSessionMock, navigateMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("@/features/browse/components/MapView", () => ({
  default: () => null,
}));

vi.mock("@/features/browse/containers/BuyerTab", () => ({
  default: () => null,
}));

vi.mock("./components/FarmerTab", () => ({
  default: () => null,
}));

vi.mock("@/features/listings/containers/ListingDetail", () => ({
  default: ({ id }: { id: string }) => (
    <div data-testid="listing-detail">{id}</div>
  ),
}));

vi.mock("@/features/listings/containers/PostListing", () => ({
  default: () => <div data-testid="post-listing" />,
}));

vi.mock("@/features/auth/hooks/useSession", () => ({
  useSession: useSessionMock,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

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
    useSessionMock.mockReset();
    navigateMock.mockReset();
    useSessionMock.mockReturnValue({ session: null, loading: false });
  });

  it.each(["/", "/post", "/listings/abc"])(
    "renders the farmer/buyer tabs at %s",
    async (path) => {
      renderAt(path);
      fireEvent.click(screen.getByRole("button", { name: "Menü" }));

      expect(
        await screen.findByRole("tab", { name: /🧑‍🌾/ }),
      ).toBeInTheDocument();
    },
  );

  it("loading /listings/:id opens the detail dialog for that listing", async () => {
    renderAt("/listings/listing-1");

    expect(await screen.findByTestId("listing-detail")).toHaveTextContent(
      "listing-1",
    );
  });

  it("loading /post while signed in opens the post dialog", async () => {
    useSessionMock.mockReturnValue({
      session: { user: { id: "farmer-1" } },
      loading: false,
    });

    renderAt("/post");

    expect(await screen.findByTestId("post-listing")).toBeInTheDocument();
  });

  it("closing the detail dialog navigates back to /", async () => {
    renderAt("/listings/listing-1");
    await screen.findByTestId("listing-detail");

    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    await act(async () => {});

    expect(navigateMock).toHaveBeenCalledWith("/", { replace: true });
  });
});
