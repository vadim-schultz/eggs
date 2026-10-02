import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import type { PostListingFormState } from "@/features/listings/utils/postListingMappers";

import PostListingForm from "./PostListingForm";

const baseForm: PostListingFormState = {
  eggCount: 5,
  unit: "each",
  priceEuros: "",
  locationQuery: "",
  pin: null,
  contactNote: "",
};

function renderForm(form: PostListingFormState = baseForm) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <PostListingForm
        form={form}
        errors={{}}
        submitError={false}
        submitting={false}
        onFieldChange={vi.fn()}
        onSubmit={vi.fn<(event: FormEvent) => void>()}
      />
    </ChakraProvider>,
  );
}

describe("PostListingForm", () => {
  it("places the full-width egg row before the price field", () => {
    renderForm();

    const eggRow = screen.getByTestId("egg-quantity-row");
    const priceInput = screen.getByLabelText("Preis (€)");

    expect(
      eggRow.compareDocumentPosition(priceInput) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByTestId("unit-chip-row")).not.toBeInTheDocument();
  });
});
