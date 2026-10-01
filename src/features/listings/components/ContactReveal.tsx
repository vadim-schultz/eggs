import { Text } from "@chakra-ui/react";

import { useListingContact } from "@/features/listings/hooks/useListingContact";
import { t } from "@/i18n/t";

export default function ContactReveal({ listingId }: { listingId: string }) {
  const { contact, loading } = useListingContact(listingId);

  if (loading || !contact) return null;

  return (
    <Text>
      {t("reserve.contactNote.label")}: {contact.contact_note}
    </Text>
  );
}
