import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import ContactReveal from "./ContactReveal";

const { maybeSingleMock, eqMock, selectMock, fromMock } = vi.hoisted(() => {
  const maybeSingleMock = vi.fn();
  const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const selectMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  return { maybeSingleMock, eqMock, selectMock, fromMock };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: fromMock },
}));

function renderReveal(listingId = "listing-1") {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ContactReveal listingId={listingId} />
    </ChakraProvider>,
  );
}

describe("ContactReveal", () => {
  beforeEach(() => {
    fromMock.mockClear();
    selectMock.mockClear();
    eqMock.mockClear();
    maybeSingleMock.mockReset();
  });

  it("renders nothing when the query returns no listing_contact row", async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });

    const { container } = renderReveal();

    await waitFor(() =>
      expect(fromMock).toHaveBeenCalledWith("listing_contact"),
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the contact_note when a row is returned", async () => {
    maybeSingleMock.mockResolvedValue({
      data: { contact_note: "Ring the bell" },
      error: null,
    });

    renderReveal();

    expect(await screen.findByText(/Ring the bell/)).toBeInTheDocument();
  });
});
