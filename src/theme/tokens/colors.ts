/** Build a minimal Chakra color scale anchored at 500. */
function scale(anchor: string) {
  return {
    DEFAULT: { value: anchor },
    500: { value: anchor },
  };
}

/** Easter egg palette (Oh So Beautiful Paper–inspired). */
export const easterColors = {
  blush: scale("#E8A4B8"),
  coral: scale("#F0806C"),
  rose: scale("#D4567A"),
  burgundy: scale("#6B1E3C"),
  rust: scale("#B85C38"),
  goldenrod: scale("#D4A017"),
  seafoam: scale("#7EC8A8"),
  cornflower: scale("#5B8DEF"),
  mint: scale("#7AD99A"),
  jade: scale("#2E9B6E"),
  emerald: scale("#3CB371"),
  navy: scale("#1E3A5F"),
};

/** App primary ramp (warm coral anchor). */
export const primary = {
  DEFAULT: { value: "#E85D4A" },
  50: { value: "#FDECE9" },
  100: { value: "#F9D0C9" },
  200: { value: "#F4B0A5" },
  300: { value: "#EE8F80" },
  400: { value: "#E96F5C" },
  500: { value: "#E85D4A" },
  600: { value: "#C44A3A" },
  700: { value: "#9F382C" },
  800: { value: "#7A271F" },
  900: { value: "#551813" },
  950: { value: "#2E0C09" },
};

/** Neutral ramp for text and chrome. */
export const neutral = {
  DEFAULT: { value: "#6B7280" },
  50: { value: "#F9FAFB" },
  100: { value: "#F3F4F6" },
  200: { value: "#E5E7EB" },
  300: { value: "#D1D5DB" },
  400: { value: "#9CA3AF" },
  500: { value: "#6B7280" },
  600: { value: "#4B5563" },
  700: { value: "#374151" },
  800: { value: "#1F2937" },
  900: { value: "#111827" },
  950: { value: "#0A0F18" },
};

export const customColors = {
  ...easterColors,
  primary,
  neutral,
};
