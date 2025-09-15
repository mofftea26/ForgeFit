import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

type StepperProps = {
  index: number;
  count: number;
  children: React.ReactNode[];
};

export const Stepper: React.FC<StepperProps> = ({ index, count, children }) => {
  const step = useSharedValue(index);
  React.useEffect(() => {
    // snappy but fluid
    step.value = withSpring(index, { mass: 0.9, damping: 18, stiffness: 160 });
  }, [index]);

  const primary = useThemeColor({}, "primary");
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");

  return (
    <View style={{ flex: 1 }}>
      {/* Slides container */}
      <View style={{ flex: 1, overflow: "hidden" }}>
        {React.Children.map(children, (child, i) => (
          <Slide key={i} i={i} step={step}>
            {child}
          </Slide>
        ))}
      </View>

      {/* Progress (floating pill + dots) */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <View
          style={{
            height: 8,
            borderRadius: 999,
            backgroundColor: outline,
            opacity: 0.35,
            overflow: "hidden",
          }}
        >
          <Pill step={step} count={count} color={primary} />
        </View>

        <Dots step={step} count={count} color={primary} bg={surface} />
      </View>
    </View>
  );
};

const Slide: React.FC<{
  i: number;
  step: SharedValue<number>;
  children: React.ReactNode;
}> = ({ i, step, children }) => {
  const style = useAnimatedStyle(() => {
    const tx = (i - step.value) * width;
    const s = interpolate(
      Math.abs(i - step.value),
      [0, 1],
      [1, 0.96],
      Extrapolation.CLAMP
    );
    const op = interpolate(
      Math.abs(i - step.value),
      [0, 0.7, 1],
      [1, 0.7, 0.4],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: tx }, { scale: s }],
      opacity: op,
    };
  });
  return (
    <Animated.View
      style={[{ position: "absolute", width, padding: 16 }, style]}
    >
      {children}
    </Animated.View>
  );
};

const Pill: React.FC<{
  step: SharedValue<number>;
  count: number;
  color: string;
}> = ({ step, count, color }) => {
  const style = useAnimatedStyle(() => {
    const w = ((step.value + 1) / count) * 100;
    return { width: `${w}%` };
  });
  return (
    <Animated.View
      style={[{ height: 8, backgroundColor: color, borderRadius: 999 }, style]}
    />
  );
};

const Dots: React.FC<{
  step: SharedValue<number>;
  count: number;
  color: string;
  bg: string;
}> = ({ step, count, color, bg }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} i={i} step={step} color={color} bg={bg} />
      ))}
    </View>
  );
};

const Dot: React.FC<{
  i: number;
  step: SharedValue<number>;
  color: string;
  bg: string;
}> = ({ i, step, color, bg }) => {
  const style = useAnimatedStyle(() => {
    const active = 1 - Math.min(1, Math.abs(step.value - i));
    const size = interpolate(active, [0, 1], [6, 10]);
    const op = interpolate(active, [0, 1], [0.4, 1]);
    return {
      width: size,
      height: size,
      opacity: op,
      backgroundColor: color,
      transform: [{ scale: interpolate(active, [0, 1], [0.9, 1]) }],
    };
  });
  return (
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: bg,
      }}
    >
      <Animated.View style={[{ borderRadius: 999 }, style]} />
    </View>
  );
};
