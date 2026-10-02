import {
  Combobox,
  createListCollection,
  Flex,
  IconButton,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
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

  const listOpen = query.trim().length > 0 && (searching || candidates.length > 0);

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
          if (!details.open && query.trim()) {
            onQueryChange(query);
          }
        }}
        onValueChange={(details) => {
          const value = details.value[0];
          if (!value) return;
          const item = collection.items.find((entry) => entry.value === value);
          if (item) {
            onSelect({ label: item.label, lat: item.lat, lng: item.lng });
            onQueryChange(item.label);
          }
        }}
        closeOnSelect
        w="full"
      >
        <Combobox.Control>
          <Combobox.Input
            placeholder={t("location.searchPlaceholder")}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
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
                  onClick={() => {
                    onSelect({
                      label: item.label,
                      lat: item.lat,
                      lng: item.lng,
                    });
                    onQueryChange(item.label);
                  }}
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
