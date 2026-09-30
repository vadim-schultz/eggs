import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import AppDialog from "./AppDialog";

function renderDialog(open: boolean, onClose = vi.fn()) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AppDialog open={open} onClose={onClose}>
        <div>Dialog content</div>
      </AppDialog>
    </ChakraProvider>,
  );
}

describe("AppDialog", () => {
  it("renders nothing when closed", () => {
    renderDialog(false);

    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("renders its content when open", () => {
    renderDialog(true);

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    renderDialog(true, onClose);

    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    await act(async () => {});

    expect(onClose).toHaveBeenCalled();
  });
});
