import { tokens } from "./tokens";

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
