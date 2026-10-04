import { defineSlotRecipe } from "@chakra-ui/react";

/** Thick coloured track and a big round sticker thumb. */
export const sliderSlotRecipe = defineSlotRecipe({
  slots: ["root", "track", "range", "thumb"],
  base: {
    track: { borderRadius: "full", bg: "colorPalette.subtle" },
    range: { borderRadius: "full" },
    thumb: {
      borderRadius: "full",
      borderWidth: "2px",
      borderColor: "colorPalette.solid",
      boxShadow: "sticker",
    },
  },
  variants: {
    size: {
      md: {
        root: {
          "--slider-thumb-size": "sizes.7",
          "--slider-track-size": "sizes.3",
        },
      },
    },
  },
});
