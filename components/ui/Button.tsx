import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Variant =
  | "primary"
  | "secondary"
  | "accent"
  | "warning"
  | "subtle"
  | "outline"
  | "ghost";

type Size = "sm" | "md" | "lg";
type Status = "idle" | "loading" | "success" | "error";

export type ButtonProps = {
  title?: string;
  onPress?: (e: GestureResponderEvent) => void | Promise<any>;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean; // controlled loading
  status?: Status; // controlled status (overrides internal)
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  accessibilityLabel?: string;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  style,
  textStyle,
  fullWidth,
  disabled,
  loading: loadingProp,
  status: statusProp,
  leading,
  trailing,
  accessibilityLabel,
}) => {
  // theme colors
  const cText = useThemeColor({}, "text");
  const cBg = useThemeColor({}, "background");
  const cPrimary = useThemeColor({}, "primary");
  const cPrimarySoft = useThemeColor({}, "primarySoft");
  const cPrimaryTint = useThemeColor({}, "primaryTint");
  const cAccent = useThemeColor({}, "accent");
  const cAccentAlt = useThemeColor({}, "accentAlt");
  const cSurface = useThemeColor({}, "surface");
  const cOutline = useThemeColor({}, "outline");
  const cMuted = useThemeColor({}, "muted");

  // sizing
  const PAD_Y = { sm: 8, md: 11, lg: 14 }[size];
  const PAD_X = { sm: 12, md: 16, lg: 20 }[size];
  const FONT = { sm: 14, md: 16, lg: 18 }[size];
  const GAP = { sm: 6, md: 8, lg: 10 }[size];
  const RADIUS = { sm: 10, md: 14, lg: 18 }[size];

  // palette
  const paletteByVariant: Record<
    Variant,
    { bg: string; fg: string; border?: string }
  > = {
    primary: { bg: cPrimarySoft, fg: cBg },
    secondary: { bg: cPrimaryTint, fg: cPrimary },
    accent: { bg: cAccent, fg: cBg },
    warning: { bg: cAccentAlt, fg: cBg },
    subtle: { bg: cSurface, fg: cText, border: cOutline },
    outline: { bg: "transparent", fg: cPrimarySoft, border: cOutline },
    ghost: { bg: "transparent", fg: cPrimarySoft },
  };
  const pal = paletteByVariant[variant];

  // status & loading (controlled or internal)
  const [internalStatus, setInternalStatus] = useState<Status>("idle");
  const status = statusProp ?? internalStatus;
  const loading = loadingProp ?? status === "loading";

  // animations
  const scale = useSharedValue(1);
  const ripple = useSharedValue(0); // 0..1 opacity
  const shakeX = useSharedValue(0); // error shake
  const pulse = useSharedValue(0); // success pulse

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: ripple.value,
  }));

  // press feedback
  const onPressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    ripple.value = withTiming(0.08, { duration: 90 });
  };
  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
    ripple.value = withTiming(0, { duration: 120 });
  };

  // error shake
  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 80 }),
      withTiming(-4, { duration: 80 }),
      withTiming(4, { duration: 80 }),
      withTiming(0, { duration: 70 })
    );
  };

  // success pulse (ring)
  const triggerPulse = () => {
    pulse.value = 0;
    pulse.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 400 })
    );
  };

  // handle async onPress automatically
  const handlePress = useCallback(
    async (e: GestureResponderEvent) => {
      if (!onPress || disabled || loading) return;
      const ret = onPress(e);
      if (ret && typeof (ret as any).then === "function") {
        setInternalStatus("loading");
        try {
          await (ret as Promise<any>);
          setInternalStatus("success");
          triggerPulse();
          // reset back to idle after a short moment
          setTimeout(() => setInternalStatus("idle"), 900);
        } catch {
          setInternalStatus("error");
          triggerShake();
          setTimeout(() => setInternalStatus("idle"), 1200);
        }
      }
    },
    [onPress, disabled, loading]
  );

  // icon/content by status
  const renderLeading = () => {
    if (loading) return <ActivityIndicator color={pal.fg} />;
    if (status === "success")
      return <Ionicons name="checkmark" size={18} color={pal.fg} />;
    if (status === "error")
      return <Ionicons name="alert" size={18} color={pal.fg} />;
    return leading ?? null;
  };

  // status-aware colors (error/success tint for outline & subtle)
  const bgColor =
    status === "error" &&
    (variant === "subtle" || variant === "outline" || variant === "ghost")
      ? "transparent"
      : pal.bg;

  const borderColor =
    status === "error"
      ? cAccentAlt
      : status === "success"
      ? cAccent
      : pal.border;

  const textColor =
    variant === "ghost" || variant === "outline"
      ? status === "error"
        ? cAccentAlt
        : pal.fg
      : pal.fg;

  // pulse ring style
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 1 + pulse.value * 0.25 }],
  }));

  return (
    <Animated.View
      style={[animStyle, { width: fullWidth ? "100%" : undefined }]}
    >
      <Pressable
        disabled={disabled || loading}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: PAD_Y,
            paddingHorizontal: PAD_X,
            borderRadius: RADIUS,
            backgroundColor: bgColor,
            borderWidth: borderColor ? 1 : 0,
            borderColor,
            opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
            overflow: "hidden",
          },
          style,
        ]}
      >
        {/* Ripple overlay */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleFill,
              backgroundColor: "#000",
            },
            rippleStyle,
          ]}
        />

        {/* Success pulse ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              ...StyleFill,
              borderRadius: RADIUS,
              borderWidth: 2,
              borderColor: status === "success" ? cAccent : "transparent",
            },
            pulseStyle,
          ]}
        />

        {/* Leading */}
        {renderLeading() ? (
          <View style={{ marginRight: title ? GAP : 0 }}>
            {renderLeading()}
          </View>
        ) : null}

        {/* Title */}
        {title ? (
          <Text
            style={[
              {
                color: textColor,
                fontSize: FONT,
                fontFamily: "WorkSans_600SemiBold",
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}

        {/* Trailing */}
        {!loading && trailing ? (
          <View style={{ marginLeft: GAP }}>{trailing}</View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
};

// absolute fill helper
const StyleFill: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};
