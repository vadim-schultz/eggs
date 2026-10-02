import { Flex, Slider, Text } from "@chakra-ui/react";

export interface SliderWithValueProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

/** Chakra slider with a numeric value label left of the track. */
export default function SliderWithValue({
  min,
  max,
  step,
  value,
  onValueChange,
  formatValue = (current) => String(current),
}: SliderWithValueProps) {
  return (
    <Flex align="center" gap="3" w="full">
      <Text
        data-testid="slider-with-value-label"
        flexShrink={0}
        fontSize="sm"
        fontVariantNumeric="tabular-nums"
        minW="2.5rem"
        textAlign="end"
      >
        {formatValue(value)}
      </Text>
      <Slider.Root
        flex="1"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(details) => onValueChange(details.value[0] ?? min)}
        w="full"
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
    </Flex>
  );
}
