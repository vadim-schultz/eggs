import KeyValueRow from "@/components/ui/KeyValueRow";
import LocationPicker from "@/features/location/components/LocationPicker";
import type { ConfirmedPin } from "@/features/location/types/place";
import { t } from "@/i18n/t";

import RadiusSlider from "./RadiusSlider";

export interface BuyerSearchRowsProps {
  radiusM: number;
  onRadiusChange: (radiusM: number) => void;
  locationQuery: string;
  onLocationQueryChange: (query: string) => void;
  manualCenter: ConfirmedPin | null;
  onConfirmLocation: (pin: ConfirmedPin) => void;
  onRequestGeolocation: () => void;
}

export default function BuyerSearchRows({
  radiusM,
  onRadiusChange,
  locationQuery,
  onLocationQueryChange,
  manualCenter,
  onConfirmLocation,
  onRequestGeolocation,
}: BuyerSearchRowsProps) {
  return (
    <>
      <KeyValueRow label={t("home.radius.label")}>
        <RadiusSlider radiusM={radiusM} onChange={onRadiusChange} />
      </KeyValueRow>
      <KeyValueRow label={t("post.location.shortLabel")}>
        <LocationPicker
          query={locationQuery}
          onQueryChange={onLocationQueryChange}
          confirmed={manualCenter}
          onConfirm={onConfirmLocation}
          onRequestGeolocation={onRequestGeolocation}
          embedInRow
        />
      </KeyValueRow>
    </>
  );
}
