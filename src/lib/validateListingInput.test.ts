import { describe, expect, it } from "vitest";

import {
  validateListingInput,
  type ListingInput,
} from "./validateListingInput";

function wellFormedInput(): ListingInput {
  return {
    eggCount: 12,
    unit: "dozen",
    priceCents: 400,
    locationLabel: "Downtown, near the market",
    note: "",
    contactNote: "Ring the bell",
  };
}

describe("validateListingInput", () => {
  it("rejects egg_count <= 0", () => {
    const errors = validateListingInput({ ...wellFormedInput(), eggCount: 0 });

    expect(errors.eggCount).toBeDefined();
  });

  it("rejects negative price_cents", () => {
    const errors = validateListingInput({
      ...wellFormedInput(),
      priceCents: -1,
    });

    expect(errors.priceCents).toBeDefined();
  });

  it("rejects an empty location_label or contact_note after trim", () => {
    const errors = validateListingInput({
      ...wellFormedInput(),
      locationLabel: "   ",
      contactNote: "  ",
    });

    expect(errors.locationLabel).toBeDefined();
    expect(errors.contactNote).toBeDefined();
  });

  it("accepts a well-formed input", () => {
    const errors = validateListingInput(wellFormedInput());

    expect(errors).toEqual({});
  });
});
