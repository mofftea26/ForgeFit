import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { LucideIcon } from "lucide-react-native";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  title: string;
  Icon: LucideIcon;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export const AccordionWrapper: React.FC<Props> = ({
  title,
  Icon,
  defaultOpen = true,
  children,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");

  // open state (children always mounted)
  const [open, setOpen] = React.useState(!!defaultOpen);

  // animation drivers
  const progress = useSharedValue(defaultOpen ? 1 : 0); // 0..1 (height/opacity/slide)
  const arrow = useSharedValue(defaultOpen ? 1 : 0); // 0..1 (rotation)
  const measuredH = useSharedValue(0); // measured content height

  const toggle = () => {
    const to = open ? 0 : 1;
    setOpen(!open);
    progress.value = withTiming(to, {
      duration: to ? 460 : 380, // calmer, smoother
      easing: to ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
    arrow.value = withTiming(to, {
      duration: to ? 420 : 340,
      easing: Easing.out(Easing.cubic),
    });
  };

  // Animated styles
  const contentStyle = useAnimatedStyle(() => ({
    height: measuredH.value * progress.value, // dynamic height
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [-10, 0]) }],
    overflow: "hidden",
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(arrow.value, [0, 1], [-90, 0])}deg` }],
  }));

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
      }}
    >
      {/* Header (tone matches InfoSection text) */}
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingBottom: 6,
        }}
      >
        <Icon size={16} color={text} />
        <P style={{ color: text, fontFamily: "WorkSans_700Bold" }}>{title}</P>
        <View style={{ flex: 1 }} />
        <Animated.View style={arrowStyle}>
          <ChevronDown size={18} color={text} />
        </Animated.View>
      </Pressable>

      {/* Animated container (children always mounted) */}
      <Animated.View style={contentStyle}>
        <View style={{ paddingTop: 8 }}>{children}</View>
      </Animated.View>

      {/* Hidden measurer: ALWAYS outside the collapsing view */}
      <View
        collapsable={false} // required on Android to measure
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          opacity: 0,
          zIndex: -1,
        }}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          // Smoothly adapt when content length changes (even while open)
          measuredH.value = withTiming(h, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          });
        }}
      >
        <View style={{ paddingTop: 8 }}>{children}</View>
      </View>
    </View>
  );
};
