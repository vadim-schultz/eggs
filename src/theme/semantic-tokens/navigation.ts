import { mode } from "./mode";

/** Floating shell and nav chrome. */
export const nav = {
  bg: mode("{colors.accent.subtle}", "{colors.neutral.900}"),
  border: mode("{colors.primary.solid}", "{colors.primary.solid}"),
  fg: mode("{colors.neutral.700}", "{colors.neutral.200}"),
};
