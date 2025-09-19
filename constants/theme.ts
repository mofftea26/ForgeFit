import { Platform } from "react-native";

/**
 * Brand palette (ForgeFit)
 *  #9FE7F5  #429EBD  #053F5C  #F7AD19  #F27F0C
 *
 * New roles:
 * - onTint/onPrimary/onAccent: readable text/icon on tinted/primary/accent surfaces
 * - scrim: modal backdrop
 * - surfaceElevated: subtle contrast block on top of surface
 * - mediaBg: neutral backdrop behind media (images/video)
 * - chipOnTintBg/chipOnTintBorder: chips/badges displayed over tinted headers
 */

export const Colors = {
  light: {
    // Base
    text: "#0F1720",
    background: "#FFFFFF",

    // Accents
    tint: "#429EBD",

    // UI
    icon: "#053F5C",
    tabIconDefault: "#9FE7F5",
    tabIconSelected: "#429EBD",

    // Brand roles
    primary: "#053F5C",
    primarySoft: "#429EBD",
    primaryTint: "#9FE7F5",

    accent: "#F7AD19",
    accentAlt: "#F27F0C",
    muted: "#8B94A7",
    surface: "#F7F9FB",
    outline: "#E5E9EF",

    // NEW readable-on-* roles
    onTint: "#FFFFFF",
    onPrimary: "#FFFFFF",
    onAccent: "#0F1720",

    // NEW surfaces & effects
    scrim: "rgba(5, 15, 20, 0.45)", // modal backdrop
    surfaceElevated: "#F4F7FA", // subtle block inside sheets/cards
    mediaBg: "#0B1420", // behind images/videos

    // NEW chips/badges when placed on tinted backgrounds
    chipOnTintBg: "rgba(255,255,255,0.18)",
    chipOnTintBorder: "rgba(255,255,255,0.35)",
  },

  dark: {
    // Base
    text: "#ECEDEE",
    background: "#0B1420",

    // Accents
    tint: "#429EBD",

    // UI
    icon: "#9FE7F5",
    tabIconDefault: "#053F5C",
    tabIconSelected: "#429EBD",

    // Brand roles
    primary: "#9FE7F5",
    primarySoft: "#429EBD",
    primaryTint: "#053F5C",

    accent: "#F7AD19",
    accentAlt: "#F27F0C",
    muted: "#9BA1A6",
    surface: "#0E1A26",
    outline: "#132233",

    // NEW readable-on-* roles
    onTint: "#FFFFFF", // good contrast over #429EBD
    onPrimary: "#0B1420", // readable over #9FE7F5
    onAccent: "#0B1420",

    // NEW surfaces & effects
    scrim: "rgba(0,0,0,0.65)",
    surfaceElevated: "#122133", // slightly lifted over surface
    mediaBg: "#000000",

    // NEW chips/badges on tinted backgrounds
    chipOnTintBg: "rgba(255,255,255,0.12)",
    chipOnTintBorder: "rgba(255,255,255,0.22)",
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
