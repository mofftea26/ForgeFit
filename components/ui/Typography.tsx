import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

/** ----------------------------------------------------------------
 * Font helpers
 * ----------------------------------------------------------------*/
type Weight = "regular" | "medium" | "semibold" | "bold";
type Align = "auto" | "left" | "right" | "center" | "justify";
type Tone = "text" | "muted" | "primary" | "accent" | "accentAlt";

function headingFamily(weight: Weight): string {
  // Syne: we loaded 600 + 700 in FontGate
  switch (weight) {
    case "bold":
    case "semibold":
      return "Syne_700Bold";
    case "medium":
    case "regular":
    default:
      return "Syne_600SemiBold";
  }
}
function bodyFamily(weight: Weight): string {
  // Work Sans: we loaded 400 + 600 in FontGate
  switch (weight) {
    case "bold":
    case "semibold":
      return "WorkSans_600SemiBold";
    case "regular":
    case "medium":
    default:
      return "WorkSans_400Regular";
  }
}

/** Get a themed color key that exists in both modes */
function useTone(tone: Tone) {
  return useThemeColor({}, tone as any);
}

type BaseProps = Omit<TextProps, "style"> & {
  color?: Tone;
  align?: Align;
  weight?: Weight;
  italic?: boolean;
  uppercase?: boolean;
  style?: TextStyle | TextStyle[];
};

/** Factory to create text components with defaults */
function createTextComponent({
  defaultSize,
  isHeading,
}: {
  defaultSize: number;
  isHeading: boolean;
}) {
  const Comp: React.FC<BaseProps> = ({
    color = "text",
    align = "left",
    weight = isHeading ? "bold" : "regular",
    italic,
    uppercase,
    style,
    children,
    ...rest
  }) => {
    const colorVal = useTone(color);

    const fontFamily = isHeading ? headingFamily(weight) : bodyFamily(weight);

    const base: TextStyle = {
      color: colorVal,
      fontSize: defaultSize,
      fontFamily,
      textAlign: align,
      textTransform: uppercase ? "uppercase" : "none",
      fontStyle: italic ? "italic" : "normal",
      includeFontPadding: false, // slightly tighter layout on Android
    };

    return (
      <Text {...rest} style={[base, style]}>
        {children}
      </Text>
    );
  };
  return Comp;
}

/** ----------------------------------------------------------------
 * Headings
 * ----------------------------------------------------------------*/
export const H1 = createTextComponent({ defaultSize: 32, isHeading: true });
export const H2 = createTextComponent({ defaultSize: 24, isHeading: true });
export const H3 = createTextComponent({ defaultSize: 20, isHeading: true });
export const H4 = createTextComponent({ defaultSize: 18, isHeading: true });

/** ----------------------------------------------------------------
 * Body text
 * ----------------------------------------------------------------*/
export const Subtitle = createTextComponent({
  defaultSize: 18,
  isHeading: false,
});
export const P = createTextComponent({ defaultSize: 16, isHeading: false });
export const Small = createTextComponent({ defaultSize: 14, isHeading: false });
export const Caption = createTextComponent({
  defaultSize: 12,
  isHeading: false,
});

/** Monospace for code/snippets */
export const Mono: React.FC<BaseProps> = ({ style, children, ...rest }) => {
  const colorVal = useTone(rest.color ?? "text");
  return (
    <Text
      {...rest}
      style={[
        {
          color: colorVal,
          fontSize: 14,
          fontFamily:
            "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

/** Link text with brand color + pressed opacity */
export const TextLink: React.FC<BaseProps & { onPress?: () => void }> = ({
  style,
  children,
  onPress,
  color = "primary",
  weight = "semibold",
  ...rest
}) => {
  const c = useTone(color);
  return (
    <Text
      {...rest}
      onPress={onPress}
      style={[
        {
          color: c,
          fontFamily: bodyFamily(weight),
          fontSize: 16,
          textDecorationLine: "underline",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
