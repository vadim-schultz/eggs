import { mode } from "./mode";

/** Floating shell and nav chrome. */
export const nav = {
  bg: mode("white", "{colors.neutral.900}"),
  border: mode("{colors.neutral.200}", "{colors.neutral.700}"),
  fg: mode("{colors.neutral.700}", "{colors.neutral.200}"),
};
