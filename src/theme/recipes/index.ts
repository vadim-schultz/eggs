import { badgeRecipe } from "./badge";
import { buttonRecipe } from "./button";
import { cardSlotRecipe } from "./card";
import { comboboxSlotRecipe } from "./combobox";
import { sliderSlotRecipe } from "./slider";

export const recipes = { button: buttonRecipe, badge: badgeRecipe };

export const slotRecipes = {
  card: cardSlotRecipe,
  slider: sliderSlotRecipe,
  combobox: comboboxSlotRecipe,
};
