import { ramp } from "./ramp";

/** Easter egg palette (Oh So Beautiful Paper–inspired). */
export const easterColors = {
  blush: ramp("#F4B6C8"),
  coral: ramp("#FF8A75"),
  rose: ramp("#F27A9D"),
  burgundy: ramp("#C2527E"),
  rust: ramp("#E88A5E"),
  goldenrod: ramp("#F2C14E"),
  seafoam: ramp("#8EDCBC"),
  cornflower: ramp("#7AA5FF"),
  mint: ramp("#8BE5A9"),
  jade: ramp("#4DC092"),
  emerald: ramp("#5CCB8A"),
  navy: ramp("#5E86C4"),
};

/** Neutral ramp for text and chrome. */
export const neutral = {
  ...ramp("#8A7A80"),
  50: { value: "#FFF9F3" },
  100: { value: "#FBEFE6" },
  200: { value: "#F1DFD3" },
  300: { value: "#DEC8C0" },
  400: { value: "#B09BA0" },
  600: { value: "#6A5560" },
  700: { value: "#4C3A4C" },
  800: { value: "#302438" },
  900: { value: "#1F1730" },
  950: { value: "#141024" },
};

export const customColors = {
  ...easterColors,
  neutral,
};
