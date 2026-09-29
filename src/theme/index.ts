import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import "./fonts";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Bree Serif', serif" },
        body: { value: "'DM Sans', system-ui, -apple-system, sans-serif" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
