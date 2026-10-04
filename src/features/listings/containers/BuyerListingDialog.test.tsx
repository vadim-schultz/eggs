import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Listing } from "@/features/listings/types/listing";
import BuyerListingDialog from "./BuyerListingDialog";

const { fetchContactMock } = vi.hoisted(() => ({ fetchContactMock: vi.fn() }));

vi.mock("@/features/listings/services/listingsApi", () => ({
  fetchListingContact: fetchContactMock,
}));

vi.mock("@/features/listings/components/ReserveButton", () => ({
  default: ({ onChange }: { onChange: () => void }) => (
    <button onClick={onChange} type="button">
      reserve
    </button>
  ),
}));

const listing = { id: "l1", status: "active" } as Listing;

function renderDialog() {
  render(
    <ChakraProvider value={defaultSystem}>
      <BuyerListingDialog listing={listing} onChange={vi.fn()} />
    </ChakraProvider>,
  );
}

describe("BuyerListingDialog contact hint", () => {
  beforeEach(() => fetchContactMock.mockReset());

  it("shows no contact hint before reserving", async () => {
    fetchContactMock.mockResolvedValue({ contact: null });
    renderDialog();
    await waitFor(() => expect(fetchContactMock).toHaveBeenCalled());
    expect(screen.queryByText(/Kontakthinweis/)).toBeNull();
  });

  it("shows the contact note after a reserve without a status change", async () => {
    fetchContactMock
      .mockResolvedValueOnce({ contact: null })
      .mockResolvedValue({ contact: { contact_note: "call me" } });
    renderDialog();
    await waitFor(() => expect(fetchContactMock).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText("reserve"));
    expect(await screen.findByText(/call me/)).toBeInTheDocument();
  });
});
