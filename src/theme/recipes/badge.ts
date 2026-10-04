import { defineRecipe } from "@chakra-ui/react";

/** Pastel, fully rounded badge. */
export const badgeRecipe = defineRecipe({
  base: {
    borderRadius: "full",
    fontWeight: "bold",
    px: "2.5",
  },
});
