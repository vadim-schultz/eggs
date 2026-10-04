/** Playful keyframes; apply only under `_motionSafe` (reduced-motion gate). */
export const keyframes = {
  wiggle: {
    "0%, 100%": { transform: "rotate(0deg)" },
    "25%": { transform: "rotate(-14deg)" },
    "75%": { transform: "rotate(14deg)" },
  },
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "40%": { transform: "translateY(-4px)" },
    "70%": { transform: "translateY(1px)" },
  },
  pop: {
    "0%": { transform: "translateY(0) scale(0)", opacity: "0" },
    "40%": { transform: "translateY(-60px) scale(1.3)", opacity: "1" },
    "100%": { transform: "translateY(-120px) scale(1)", opacity: "0" },
  },
};
