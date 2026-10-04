export interface SellerReservationRow {
  id: string;
  egg_count: number;
  created_at: string;
  listing_id: string;
  location_label: string;
}

export interface BuyerReservationRow extends SellerReservationRow {
  contact_note: string | null;
}

type Contact = { contact_note: string } | { contact_note: string }[] | null;

export interface ReservationEmbed {
  id: string;
  egg_count: number;
  created_at: string;
  listing_id: string;
  listing: {
    location_label: string;
    listing_contact?: Contact;
  } | null;
}

export function toSellerRow(row: ReservationEmbed): SellerReservationRow {
  return {
    id: row.id,
    egg_count: row.egg_count,
    created_at: row.created_at,
    listing_id: row.listing_id,
    location_label: row.listing?.location_label ?? "",
  };
}

export function toBuyerRow(row: ReservationEmbed): BuyerReservationRow {
  const contact = row.listing?.listing_contact;
  const note = Array.isArray(contact) ? contact[0] : contact;
  return { ...toSellerRow(row), contact_note: note?.contact_note ?? null };
}
