import { mode } from "./mode";

/** Foreground colours for body copy and headings. */
export const fg = {
  DEFAULT: mode("{colors.neutral.900}", "{colors.neutral.50}"),
  muted: mode("{colors.neutral.500}", "{colors.neutral.400}"),
};
