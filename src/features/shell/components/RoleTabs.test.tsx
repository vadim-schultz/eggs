import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import RoleTabs from "./RoleTabs";

vi.mock("@/features/browse/containers/BuyerTab", () => ({
  default: () => <div data-testid="buyer-tab" />,
}));

vi.mock("./FarmerTab", () => ({
  default: () => <div data-testid="farmer-tab" />,
}));

function renderRoleTabs() {
  return render(
    <ChakraProvider value={defaultSystem}>
      <RoleTabs />
    </ChakraProvider>,
  );
}

describe("RoleTabs", () => {
  it("renders a farmer tab and a buyer tab trigger", () => {
    renderRoleTabs();

    expect(screen.getByRole("tab", { name: /🧑‍🌾/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /👨🏻‍💼/ })).toBeInTheDocument();
  });

  it("shows Verkäufer and Käufer labels without Landwirt", () => {
    renderRoleTabs();

    expect(screen.getByRole("tab", { name: /Verkäufer/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Käufer/ })).toBeInTheDocument();
    expect(screen.queryByText("Landwirt")).not.toBeInTheDocument();
  });

  it("defaults to the buyer tab's content visible", () => {
    renderRoleTabs();

    expect(screen.getByRole("tab", { name: /👨🏻‍💼/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("clicking the farmer tab shows farmer content and hides buyer content", async () => {
    renderRoleTabs();

    fireEvent.click(screen.getByRole("tab", { name: /🧑‍🌾/ }));

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /🧑‍🌾/ })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });
    expect(screen.getByRole("tab", { name: /👨🏻‍💼/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });
});
