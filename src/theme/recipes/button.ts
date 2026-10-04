import { defineRecipe } from "@chakra-ui/react";

/** Chunky pill button with a sticker shadow and a bouncy press. */
export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "full",
    fontWeight: "bold",
    transitionProperty: "transform, box-shadow, background",
    transitionDuration: "fast",
    _hover: { transform: "translateY(-1px)" },
    _motionSafe: { _hover: { animation: "bounce 0.5s ease-in-out" } },
    _active: {
      transform: "translate(2px, 2px) scale(0.97)",
      boxShadow: "none",
    },
  },
  variants: {
    variant: {
      solid: { boxShadow: "sticker" },
    },
  },
});
