import { Text } from "@chakra-ui/react";

import { t } from "@/i18n/t";
import type { ListingErrorKey } from "@/features/listings/types/listingInput";

export default function FieldError({
  errorKey,
}: {
  errorKey?: ListingErrorKey;
}) {
  if (!errorKey) return null;
  return <Text color="fg.error">{t(errorKey)}</Text>;
}
