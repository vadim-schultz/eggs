import { Button } from "@chakra-ui/react";

import { t } from "@/i18n/t";

interface AddListingTriggerProps {
  onAddListing: () => void;
}

export default function AddListingTrigger({
  onAddListing,
}: AddListingTriggerProps) {
  return <Button onClick={onAddListing}>{t("nav.postListing")}</Button>;
}
