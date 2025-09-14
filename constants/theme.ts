// constants/theme.ts
import { Platform } from "react-native";

/**
 * Brand palette (ForgeFit)
 *  #9FE7F5  #429EBD  #053F5C  #F7AD19  #F27F0C
 */

export const Colors = {
  light: {
    // Base
    text: "#0F1720",
    background: "#FFFFFF",

    // Primary accent used by useThemeColor(...,'tint')
    tint: "#429EBD",

    // UI
    icon: "#053F5C",
    tabIconDefault: "#9FE7F5",
    tabIconSelected: "#429EBD",

    // Extra brand roles (added to BOTH themes so useThemeColor can read them)
    primary: "#053F5C", // deep blue (headers/buttons bg if needed)
    primarySoft: "#429EBD", // mid blue
    primaryTint: "#9FE7F5", // light blue

    accent: "#F7AD19", // gold (warnings/CTAs)
    accentAlt: "#F27F0C", // orange (secondary CTA/active)
    muted: "#8B94A7", // neutral text/icons
    surface: "#F7F9FB", // card / sheet bg
    outline: "#E5E9EF", // borders / dividers
  },

  dark: {
    // Base
    text: "#ECEDEE",
    background: "#0B1420", // dark navy, friendly with brand blues

    // Primary accent used by useThemeColor(...,'tint')
    tint: "#429EBD",

    // UI
    icon: "#9FE7F5",
    tabIconDefault: "#053F5C",
    tabIconSelected: "#429EBD",

    // Extra brand roles (must exist in both themes)
    primary: "#9FE7F5",
    primarySoft: "#429EBD",
    primaryTint: "#053F5C",

    accent: "#F7AD19",
    accentAlt: "#F27F0C",
    muted: "#9BA1A6",
    surface: "#0E1A26",
    outline: "#132233",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
