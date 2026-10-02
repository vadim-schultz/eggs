import { mode } from "./mode";

/** Page and panel backgrounds. */
export const bg = {
  DEFAULT: mode("white", "{colors.neutral.950}"),
  muted: mode("{colors.neutral.50}", "{colors.neutral.900}"),
  subtle: mode("{colors.neutral.100}", "{colors.neutral.800}"),
};
