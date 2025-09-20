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

const CONTENT_TOP_PAD = 8;
const HEIGHT_BUFFER = 2; // <- prevents the last line from clipping due to rounding

export const AccordionWrapper: React.FC<Props> = ({
  title,
  Icon,
  defaultOpen = true,
  children,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");

  const [open, setOpen] = React.useState(!!defaultOpen);

  // anim drivers
  const progress = useSharedValue(defaultOpen ? 1 : 0); // 0..1 (height/opacity/slide)
  const arrow = useSharedValue(defaultOpen ? 1 : 0); // 0..1 (rotation)
  const measuredH = useSharedValue(0); // content height in SAME padding context

  const toggle = () => {
    const to = open ? 0 : 1;
    setOpen(!open);
    progress.value = withTiming(to, {
      duration: to ? 460 : 380,
      easing: to ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
    arrow.value = withTiming(to, {
      duration: to ? 420 : 340,
      easing: Easing.out(Easing.cubic),
    });
  };

  const contentStyle = useAnimatedStyle(() => ({
    height: Math.max(
      0,
      measuredH.value * progress.value +
        (progress.value > 0 ? HEIGHT_BUFFER : 0)
    ),
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
        paddingHorizontal: 12, // <- visible content lives inside this padding
        paddingTop: 10,
        paddingBottom: 8,
      }}
    >
      {/* Header */}
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
        {/* IMPORTANT: same paddingTop as the measurer below */}
        <View style={{ paddingTop: CONTENT_TOP_PAD }}>{children}</View>
      </Animated.View>

      {/* Hidden measurer: SAME padding context & width as visible content */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 12, // <- match paddingHorizontal of the parent container
          right: 12, // <- match paddingHorizontal of the parent container
          opacity: 0,
          zIndex: -1,
        }}
      >
        <View
          // must be on the inner view to avoid Android collapsing optimization
          collapsable={false}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            // animate changes even when open (chip wraps, etc.)
            measuredH.value = withTiming(h, {
              duration: 260,
              easing: Easing.out(Easing.cubic),
            });
          }}
          style={{ paddingTop: CONTENT_TOP_PAD }}
        >
          {children}
        </View>
      </View>
    </View>
  );
};
