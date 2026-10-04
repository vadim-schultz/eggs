import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { recipes, slotRecipes } from "./recipes";
import { semanticTokens } from "./semantic-tokens";
import { customColors } from "./tokens/colors";
import { shadows } from "./tokens/shadows";
import "./fonts";

const config = defineConfig({
  globalCss: {
    html: { colorPalette: "primary" },
    body: { bg: "bg" },
  },
  theme: {
    tokens: {
      colors: customColors,
      fonts: {
        heading: { value: "'Bree Serif', serif" },
        body: { value: "'DM Sans', system-ui, -apple-system, sans-serif" },
      },
    },
    recipes,
    slotRecipes,
    semanticTokens: { ...semanticTokens, shadows },
  },
});

/** Eggs Chakra system: Easter palette, semantic fg/nav, Bree Serif headings. */
export const system = createSystem(defaultConfig, config);
