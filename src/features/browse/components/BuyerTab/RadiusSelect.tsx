import { Field, NativeSelect } from "@chakra-ui/react";

import { t } from "@/i18n/t";

const RADIUS_OPTIONS: {
  meters: number;
  labelKey: "home.radius.5km" | "home.radius.15km" | "home.radius.30km";
}[] = [
  { meters: 5000, labelKey: "home.radius.5km" },
  { meters: 15000, labelKey: "home.radius.15km" },
  { meters: 30000, labelKey: "home.radius.30km" },
];

export default function RadiusSelect({
  radiusM,
  onChange,
}: {
  radiusM: number;
  onChange: (radiusM: number) => void;
}) {
  return (
    <Field.Root>
      <Field.Label>{t("home.radius.label")}</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={radiusM}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {RADIUS_OPTIONS.map((option) => (
            <option key={option.meters} value={option.meters}>
              {t(option.labelKey)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}
