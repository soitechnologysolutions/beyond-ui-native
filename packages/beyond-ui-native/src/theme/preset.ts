import { tokens } from "./tokens";

export { tokens };

export const beyondUIPreset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        danger: tokens.colors.danger,
        destructive: tokens.colors.destructive,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        neutral: tokens.colors.neutral,
        background: tokens.colors.semantic.light.background,
        foreground: tokens.colors.semantic.light.foreground,
        card: {
          DEFAULT: tokens.colors.semantic.light.card,
          foreground: tokens.colors.semantic.light.cardForeground,
        },
        cardForeground: tokens.colors.semantic.light.cardForeground,
        muted: {
          DEFAULT: tokens.colors.semantic.light.mutedForeground,
          foreground: tokens.colors.semantic.light.mutedForeground,
        },
        mutedForeground: tokens.colors.semantic.light.mutedForeground,
        border: tokens.colors.semantic.light.border,
        input: tokens.colors.semantic.light.input,
      },
      borderRadius: {
        none: "0px",
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
        "2xl": `${tokens.radius["2xl"]}px`,
        full: "9999px",
      },
    },
  },
};

export default beyondUIPreset;
