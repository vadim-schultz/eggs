import { Badge } from "@chakra-ui/react";

import type { ListingStatus } from "@/features/listings/types/listing";
import { statusLabelKey } from "@/features/listings/utils/formatListing";
import { t } from "@/i18n/t";

const STATUS_ROLE = {
  active: "success",
  reserved: "warning",
  sold: "secondary",
  expired: "info",
  cancelled: "danger",
} as const satisfies Record<ListingStatus, string>;

export function statusColorPalette(status: ListingStatus): string {
  const role = STATUS_ROLE[status];
  if (!role) throw new Error(`Unknown listing status: ${status}`);
  return role;
}

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge colorPalette={statusColorPalette(status)} size="xs">
      {t(statusLabelKey(status))}
    </Badge>
  );
}
