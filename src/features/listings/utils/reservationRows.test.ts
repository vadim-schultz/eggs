import { describe, expect, it } from "vitest";

import {
  toBuyerRow,
  toSellerRow,
  type ReservationEmbed,
} from "./reservationRows";

const base: ReservationEmbed = {
  id: "r1",
  egg_count: 6,
  created_at: "2026-01-01T00:00:00Z",
  listing_id: "l1",
  listing: { location_label: "Hof Nord" },
};

describe("reservation row mappers", () => {
  it("flattens the listing place for a seller", () => {
    expect(toSellerRow(base)).toEqual({
      id: "r1",
      egg_count: 6,
      created_at: "2026-01-01T00:00:00Z",
      listing_id: "l1",
      location_label: "Hof Nord",
    });
  });

  it("maps the embedded contact note for a buyer", () => {
    const row = toBuyerRow({
      ...base,
      listing: {
        location_label: "Hof Nord",
        listing_contact: { contact_note: "Klingeln" },
      },
    });
    expect(row.contact_note).toBe("Klingeln");
    expect(row.location_label).toBe("Hof Nord");
  });

  it("reads the note from an array embed", () => {
    const row = toBuyerRow({
      ...base,
      listing: {
        location_label: "x",
        listing_contact: [{ contact_note: "A" }],
      },
    });
    expect(row.contact_note).toBe("A");
  });

  it("returns a null note when the contact is missing", () => {
    expect(toBuyerRow(base).contact_note).toBeNull();
    expect(
      toBuyerRow({
        ...base,
        listing: { location_label: "x", listing_contact: [] },
      }).contact_note,
    ).toBeNull();
  });
});
