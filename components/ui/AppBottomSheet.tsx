import { useThemeColor } from "@/hooks/use-theme-color";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  memo,
  PropsWithChildren,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Dimensions, Platform, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AppBottomSheetRef = {
  open: () => void;
  close: () => void;
  snapTo: (index: number) => void;
};

type AppBottomSheetProps = PropsWithChildren<{
  HeaderComponent?: React.ReactNode;
  FooterComponent?: React.ReactNode;
  backgroundColor?: string;
  outlineColor?: string;
  indicatorColor?: string;
  maxHeightRatio?: number;
  contentPadding?: number;
  onChangeIndex?: (index: number) => void;
  enablePanDownToClose?: boolean;
  scrollable?: boolean;
  contentStyle?: ViewStyle;
}>;

export const AppBottomSheetInner = forwardRef<
  AppBottomSheetRef,
  AppBottomSheetProps
>(
  (
    {
      HeaderComponent,
      FooterComponent,
      children,
      maxHeightRatio = 0.9,
      contentPadding = 16,
      onChangeIndex,
      enablePanDownToClose = true,
      scrollable = true,
      contentStyle,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();
    const { height: screenH } = Dimensions.get("window");
    const maxHeight = Math.round(screenH * maxHeightRatio);
    const indicatorColor = useThemeColor({}, "primary");
    const backgroundColor = useThemeColor({}, "background");
    const outlineColor = useThemeColor({}, "outline");
    const snapPoints = useMemo(() => [maxHeight * 0.5, maxHeight], [maxHeight]);

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
      snapTo: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    }));

    const containerPaddingBottom =
      Platform.OS === "ios" ? Math.max(insets.bottom, 12) : 12;

    const Inner = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onChange={onChangeIndex}
        handleIndicatorStyle={{ backgroundColor: indicatorColor }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderWidth: outlineColor ? 1 : 0,
          borderColor: outlineColor,
        }}
      >
        <View
          style={{
            maxHeight,
          }}
        >
          {HeaderComponent ? (
            <View
              style={{
                paddingHorizontal: contentPadding,
                paddingTop: contentPadding,
              }}
            >
              {HeaderComponent}
            </View>
          ) : null}

          <Inner
            bounces={false}
            keyboardShouldPersistTaps="handled" // CHANGED
            contentContainerStyle={[
              {
                paddingHorizontal: contentPadding,
                paddingTop: HeaderComponent ? 12 : contentPadding,
                paddingBottom: FooterComponent ? 12 : containerPaddingBottom,
                flexGrow: 1, // CHANGED
                minHeight: 1, // CHANGED
              },
              contentStyle,
            ]}
          >
            {children}
          </Inner>

          {FooterComponent ? (
            <View
              style={{
                paddingHorizontal: contentPadding,
                paddingBottom: containerPaddingBottom,
                paddingTop: 80,
              }}
            >
              {FooterComponent}
            </View>
          ) : null}
        </View>
      </BottomSheet>
    );
  }
);

AppBottomSheetInner.displayName = "AppBottomSheet";

export const AppBottomSheet = memo(AppBottomSheetInner);
export default AppBottomSheet;
