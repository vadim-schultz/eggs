import { Badge } from "@chakra-ui/react";

import { t } from "../i18n/t";
import type { ListingStatus } from "@/features/listings/types/listing";
import { statusLabelKey } from "@/features/listings/utils/formatListing";

export function statusColorPalette(status: ListingStatus): string {
  switch (status) {
    case "active":
      return "green";
    case "reserved":
      return "yellow";
    case "sold":
      return "blue";
    case "expired":
      return "gray";
    case "cancelled":
      return "red";
  }
}

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge colorPalette={statusColorPalette(status)} size="xs">
      {t(statusLabelKey(status))}
    </Badge>
  );
}
