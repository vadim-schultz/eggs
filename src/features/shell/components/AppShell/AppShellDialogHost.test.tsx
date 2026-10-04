import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider } from "@chakra-ui/react";

import { system } from "@/theme";
import * as appDialog from "@/features/shell/context/appDialog";
import AppShellDialogHost from "./AppShellDialogHost";

vi.mock("@/features/listings/containers/PostListing", () => ({
  default: () => <div>post form</div>,
}));
vi.mock("@/features/listings/containers/ListingDetail", () => ({
  default: () => <div>listing detail</div>,
}));

function renderHost(open: appDialog.OpenAppDialog, closeDialog = vi.fn()) {
  vi.spyOn(appDialog, "useAppDialog").mockReturnValue({
    open,
    openHereDialog: vi.fn(),
    openPostDialog: vi.fn(),
    openDetailDialog: vi.fn(),
    openPublishedDialog: vi.fn(),
    closeDialog,
  });
  render(
    <ChakraProvider value={system}>
      <AppShellDialogHost />
    </ChakraProvider>,
  );
}

describe("AppShellDialogHost", () => {
  it("shows only the published notice after publishing", () => {
    renderHost({ kind: "published" });

    expect(
      screen.getByText("Dein Angebot wurde veröffentlicht."),
    ).toBeInTheDocument();
    expect(screen.queryByText("listing detail")).not.toBeInTheDocument();
  });

  it("still shows the listing detail for a detail dialog", () => {
    renderHost({ kind: "detail", listingId: "l1" });

    expect(screen.getByText("listing detail")).toBeInTheDocument();
  });

  it("shows 'Du bist hier' for the here dialog and closes via the close button", async () => {
    const closeDialog = vi.fn();
    renderHost({ kind: "here" }, closeDialog);

    expect(screen.getByText("Du bist hier")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /schließen/i }));
    await waitFor(() => expect(closeDialog).toHaveBeenCalled());
  });

  it("shows no 'Du bist hier' for other dialogs", () => {
    renderHost({ kind: "published" });

    expect(screen.queryByText("Du bist hier")).not.toBeInTheDocument();
  });
});
