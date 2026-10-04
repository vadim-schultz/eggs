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
  it("shows 6 and 10 carton prices for a valid per-egg price", () => {
    renderForm({ ...baseForm, priceEuros: "0.35" });

    const hint = screen.getByTestId("carton-price-hint");
    expect(hint).toHaveTextContent("2,10");
    expect(hint).toHaveTextContent("3,50");
    expect(screen.getByLabelText("Preis pro Ei (€)")).toHaveAttribute(
      "step",
      "0.01",
    );
  });

  it.each(["", "abc", "-1"])("shows no carton hint for price %j", (price) => {
    renderForm({ ...baseForm, priceEuros: price });

    expect(screen.queryByTestId("carton-price-hint")).not.toBeInTheDocument();
  });

  it("places the full-width egg row before the price field", () => {
    renderForm();

    const eggRow = screen.getByTestId("egg-quantity-row");
    const priceInput = screen.getByLabelText("Preis pro Ei (€)");

    expect(
      eggRow.compareDocumentPosition(priceInput) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByTestId("unit-chip-row")).not.toBeInTheDocument();
  });
});
