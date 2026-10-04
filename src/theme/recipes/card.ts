import { defineSlotRecipe } from "@chakra-ui/react";

/** Card with a 2px coloured sticker border and hard-offset shadow. */
export const cardSlotRecipe = defineSlotRecipe({
  slots: ["root"],
  base: {
    root: {
      borderRadius: "2xl",
      borderWidth: "2px",
      borderColor: "colorPalette.muted",
      boxShadow: "sticker",
    },
  },
});
