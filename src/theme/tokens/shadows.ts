import { mode } from "../semantic-tokens/mode";

/** Hard-offset "sticker" shadow, role-coloured (semantic: differs per colour mode). */
export const shadows = {
  sticker: mode(
    "4px 4px 0 {colors.primary.emphasized}",
    "4px 4px 0 {colors.primary.muted}",
  ),
};
