import { brand } from "./brand";
import { egg } from "./eggs";
import { bg } from "./surfaces";
import { fg } from "./text";
import { nav } from "./navigation";
import { rolePalettes } from "./palettes";

/** Semantic tokens passed to the Chakra theme config. */
export const semanticTokens = {
  colors: {
    fg,
    bg,
    nav,
    brand,
    egg,
    ...rolePalettes,
  },
};
