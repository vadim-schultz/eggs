import { Badge } from "@chakra-ui/react";

import type { ListingStatus } from "@/features/listings/types/listing";
import { statusLabelKey } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

const STATUS_COLOR: Record<ListingStatus, string> = {
  active: "green",
  reserved: "yellow",
  sold: "blue",
  expired: "gray",
  cancelled: "red",
};

export function statusColorPalette(status: ListingStatus): string {
  return STATUS_COLOR[status];
}

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge colorPalette={statusColorPalette(status)} size="xs">
      {t(statusLabelKey(status))}
    </Badge>
  );
}
