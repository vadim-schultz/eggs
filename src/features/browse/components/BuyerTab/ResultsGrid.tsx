import { SimpleGrid, Text } from "@chakra-ui/react";

import ListingCard from "@/features/listings/components/ListingCard";
import type { ListingNear } from "@/features/listings/types/listing";
import { t } from "@/i18n/t";

export default function ResultsGrid({
  listings,
  selectedId,
  onSelect,
}: {
  listings: ListingNear[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (listings.length === 0) {
    return <Text>{t("home.empty")}</Text>;
  }

  return (
    <SimpleGrid data-testid="results-grid" columns={{ base: 1, sm: 2 }} gap="2">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          selected={listing.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </SimpleGrid>
  );
}
