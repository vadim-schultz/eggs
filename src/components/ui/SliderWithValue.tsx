import { Flex, Input, Slider, Text } from "@chakra-ui/react";

import useCommittedNumber from "./useCommittedNumber";

export interface SliderWithValueProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  formatValue?: (value: number) => string;
  /** Replace the static label with an integer input clamped to min…max. */
  editable?: boolean;
}

/** Chakra slider with a numeric value label left of the track. */
export default function SliderWithValue({
  min,
  max,
  step,
  value,
  onValueChange,
  formatValue = (current) => String(current),
  editable = false,
}: SliderWithValueProps) {
  const draft = useCommittedNumber({
    value,
    min,
    max,
    onCommit: onValueChange,
  });

  return (
    <Flex align="center" gap="3" w="full">
      {editable ? (
        <Input
          data-testid="slider-with-value-input"
          flexShrink={0}
          size="sm"
          minW="2.5rem"
          w="4.5rem"
          textAlign="end"
          inputMode="numeric"
          value={draft.text}
          onChange={(event) => draft.onTextChange(event.target.value)}
          onBlur={draft.commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") draft.commit();
          }}
        />
      ) : (
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
      )}
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
