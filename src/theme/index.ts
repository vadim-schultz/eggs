import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { semanticTokens } from "./semantic-tokens";
import { customColors } from "./tokens/colors";
import "./fonts";

const config = defineConfig({
  theme: {
    tokens: {
      colors: customColors,
      fonts: {
        heading: { value: "'Bree Serif', serif" },
        body: { value: "'DM Sans', system-ui, -apple-system, sans-serif" },
      },
    },
    semanticTokens,
  },
});

/** Eggs Chakra system: Easter palette, semantic fg/nav, Bree Serif headings. */
export const system = createSystem(defaultConfig, config);
