import { Slider } from "@chakra-ui/react";

const MIN_M = 5000;
const MAX_M = 30000;
const STEP_M = 5000;

export default function RadiusSlider({
  radiusM,
  onChange,
}: {
  radiusM: number;
  onChange: (radiusM: number) => void;
}) {
  const km = radiusM / 1000;

  return (
    <Slider.Root
      min={MIN_M}
      max={MAX_M}
      step={STEP_M}
      value={[radiusM]}
      onValueChange={(details) => onChange(details.value[0] ?? MIN_M)}
      w="full"
    >
      <Slider.ValueText textAlign="right">{`${km} km`}</Slider.ValueText>
      <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
    </Slider.Root>
  );
}

export { MIN_M as RADIUS_MIN_M, MAX_M as RADIUS_MAX_M, STEP_M as RADIUS_STEP_M };
