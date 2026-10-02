import { mode } from "./mode";

const eggSwatch = (name: string) =>
  mode(`{colors.${name}.500}`, `{colors.${name}.500}`);

/** Semantic aliases for egg icon cycling (slot index % 12). */
export const egg = {
  blush: eggSwatch("blush"),
  coral: eggSwatch("coral"),
  rose: eggSwatch("rose"),
  burgundy: eggSwatch("burgundy"),
  rust: eggSwatch("rust"),
  goldenrod: eggSwatch("goldenrod"),
  seafoam: eggSwatch("seafoam"),
  cornflower: eggSwatch("cornflower"),
  mint: eggSwatch("mint"),
  jade: eggSwatch("jade"),
  emerald: eggSwatch("emerald"),
  navy: eggSwatch("navy"),
};
