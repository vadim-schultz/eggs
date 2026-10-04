import { Box, Grid } from "@chakra-ui/react";
import { TbEggFilled } from "react-icons/tb";

import type { CartonSize } from "../../utils/carton";
import { eggColorForSlot } from "@/lib/eggQuantity";

const ICON_SIZE = 20;

/** Two-row grid of multi-coloured eggs for a carton (6 → 2×3, 10 → 2×5). */
export default function CartonEggs({ size }: { size: CartonSize }) {
  return (
    <Grid
      aria-hidden
      data-testid={`carton-eggs-${size}`}
      gap="0.5"
      gridAutoFlow="column"
      justifyContent="start"
      templateRows="repeat(2, auto)"
    >
      {Array.from({ length: size }, (_, i) => (
        <Box
          key={i}
          color={eggColorForSlot(i)}
          css={{
            _motionSafe: { _hover: { animation: "wiggle 0.5s ease-in-out" } },
          }}
          data-egg
          display="inline-flex"
        >
          <TbEggFilled size={ICON_SIZE} />
        </Box>
      ))}
    </Grid>
  );
}
