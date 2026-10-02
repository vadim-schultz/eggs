import {
  Combobox,
  createListCollection,
  Flex,
  IconButton,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { TbCurrentLocation } from "react-icons/tb";

import type { PlaceCandidate } from "@/features/location/types/place";
import { t } from "@/i18n/t";

type PlaceItem = {
  label: string;
  value: string;
  lat: number;
  lng: number;
};

function toPlaceItem(candidate: PlaceCandidate): PlaceItem {
  return {
    label: candidate.label,
    value: `${candidate.lat},${candidate.lng},${candidate.label}`,
    lat: candidate.lat,
    lng: candidate.lng,
  };
}

function shouldOpenListForQuery(
  query: string,
  candidates: PlaceCandidate[],
): boolean {
  const trimmed = query.trim();
  if (!trimmed) {
    return false;
  }
  return !candidates.some((candidate) => candidate.label === trimmed);
}

function candidateFromItem(item: PlaceItem): PlaceCandidate {
  return { label: item.label, lat: item.lat, lng: item.lng };
}

export interface PlaceComboboxProps {
  query: string;
  onQueryChange: (query: string) => void;
  candidates: PlaceCandidate[];
  searching: boolean;
  onSelect: (candidate: PlaceCandidate) => void;
  onRequestGeolocation?: () => void;
  geolocateLabel?: string;
}

/** Searchable Ort field with optional browser geolocation trigger. */
export default function PlaceCombobox({
  query,
  onQueryChange,
  candidates,
  searching,
  onSelect,
  onRequestGeolocation,
  geolocateLabel = t("location.geolocate"),
}: PlaceComboboxProps) {
  const collection = useMemo(
    () =>
      createListCollection({
        items: candidates.map(toPlaceItem),
      }),
    [candidates],
  );

  const [open, setOpen] = useState(false);
  const hasCandidates = searching || candidates.length > 0;
  const listOpen = open && query.trim().length > 0 && hasCandidates;

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
    }
  }, [query]);

  const syncListOpenFromQuery = (nextQuery: string) => {
    setOpen(shouldOpenListForQuery(nextQuery, candidates));
  };

  const selectCandidate = (item: PlaceItem) => {
    onSelect(candidateFromItem(item));
    onQueryChange(item.label);
    setOpen(false);
  };

  return (
    <Flex gap="2" align="center" w="full">
      {onRequestGeolocation ? (
        <IconButton
          aria-label={geolocateLabel}
          variant="outline"
          size="sm"
          flexShrink={0}
          onClick={onRequestGeolocation}
        >
          <TbCurrentLocation />
        </IconButton>
      ) : null}
      <Combobox.Root
        collection={collection}
        open={listOpen}
        onOpenChange={(details) => {
          if (!details.open) {
            setOpen(false);
            if (query.trim()) {
              onQueryChange(query);
            }
          }
        }}
        onValueChange={(details) => {
          const value = details.value[0];
          if (!value) return;
          const item = collection.items.find((entry) => entry.value === value);
          if (item) {
            selectCandidate(item);
          }
        }}
        closeOnSelect
        w="full"
      >
        <Combobox.Control>
          <Combobox.Input
            placeholder={t("location.searchPlaceholder")}
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              onQueryChange(next);
              syncListOpenFromQuery(next);
            }}
          />
          <Combobox.IndicatorGroup>
            {searching ? <Spinner size="xs" /> : null}
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>
                <Text px="3" py="2" fontSize="sm" color="fg.muted">
                  {t("location.noResults")}
                </Text>
              </Combobox.Empty>
              {collection.items.map((item) => (
                <Combobox.Item
                  key={item.value}
                  item={item}
                  onClick={() => selectCandidate(item)}
                >
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Flex>
  );
}
