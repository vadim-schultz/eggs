import { defineSlotRecipe } from "@chakra-ui/react";

/** Rounded combobox input and menu. */
export const comboboxSlotRecipe = defineSlotRecipe({
  slots: ["input", "content"],
  base: {
    input: { borderRadius: "full" },
    content: {
      borderRadius: "2xl",
      borderWidth: "2px",
      borderColor: "colorPalette.muted",
    },
  },
});
