import SliderWithValue from "@/components/ui/SliderWithValue";

const MIN_M = 5000;
const MAX_M = 15000;
const STEP_M = 5000;

export default function RadiusSlider({
  radiusM,
  onChange,
}: {
  radiusM: number;
  onChange: (radiusM: number) => void;
}) {
  return (
    <SliderWithValue
      min={MIN_M}
      max={MAX_M}
      step={STEP_M}
      value={radiusM}
      onValueChange={onChange}
      formatValue={(meters) => `${meters / 1000} km`}
    />
  );
}

export {
  MIN_M as RADIUS_MIN_M,
  MAX_M as RADIUS_MAX_M,
  STEP_M as RADIUS_STEP_M,
};
