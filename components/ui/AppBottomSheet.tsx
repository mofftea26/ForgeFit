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
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  View,
  ViewStyle,
} from "react-native";
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

    const safeBottom = Math.max(insets.bottom, 12);
    const Body = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onChange={onChangeIndex}
        handleIndicatorStyle={{ backgroundColor: indicatorColor }}
        // Keyboard behavior
        keyboardBehavior="interactive" // iOS: sheet tracks keyboard
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize" // Android: window resizes
        // Insets
        topInset={insets.top}
        bottomInset={insets.bottom}
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderWidth: outlineColor ? 1 : 0,
          borderColor: outlineColor,
        }}
        // STICKY FOOTER (never scrolls)
        footerComponent={() =>
          FooterComponent ? (
            <View
              style={{
                paddingHorizontal: contentPadding,
                paddingTop: 12,
                paddingBottom: safeBottom,
                backgroundColor,
              }}
            >
              {FooterComponent}
            </View>
          ) : null
        }
      >
        {/* Keyboard-aware wrapper made for @gorhom/bottom-sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ maxHeight, flex: 1 }}
          keyboardVerticalOffset={0} // you can tweak if you have a custom header stack height
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

          <Body
            bounces={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              {
                paddingHorizontal: contentPadding,
                paddingTop: HeaderComponent ? 12 : contentPadding,
                // keep some space above the sticky footer edge when scrolled to bottom
                paddingBottom: 12,
                flexGrow: 1,
                minHeight: 1,
              },
              contentStyle,
            ]}
          >
            {children}
          </Body>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
);

AppBottomSheetInner.displayName = "AppBottomSheet";
export const AppBottomSheet = memo(AppBottomSheetInner);
export default AppBottomSheet;
