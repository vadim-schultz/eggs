import { Select, createListCollection } from "@chakra-ui/react";

import { t } from "@/i18n/t";

export type Unit = "dozen" | "each";

const unitOptions = createListCollection({
  items: [
    { label: t("post.unit.dozen"), value: "dozen" },
    { label: t("post.unit.each"), value: "each" },
  ],
});

interface UnitSelectProps {
  value: Unit;
  onChange: (value: Unit) => void;
}

export default function UnitSelect({ value, onChange }: UnitSelectProps) {
  return (
    <Select.Root
      collection={unitOptions}
      value={[value]}
      onValueChange={(details) => onChange(details.value[0] as Unit)}
    >
      <Select.Label>{t("post.unit.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {unitOptions.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
