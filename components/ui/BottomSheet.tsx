import { H3, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Modal, Pressable, ScrollView, View, ViewStyle } from "react-native";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  infoText?: string;
  children?: React.ReactNode;
  contentStyle?: ViewStyle;
  noCloseButton?: boolean;
  scrollable?: boolean;
};

export const BottomSheet: React.FC<Props> = ({
  open,
  onClose,
  title,
  infoText,
  children,
  contentStyle,
  noCloseButton,
  scrollable = true,
}) => {
  const sheetBg = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const scrim = useThemeColor({}, "scrim");
  const surfaceElevated = useThemeColor({}, "surfaceElevated");
  const primarySoft = useThemeColor({}, "primarySoft");
  return (
    <Modal visible={open} animationType="slide" transparent>
      <View
        style={{ flex: 1, backgroundColor: scrim, justifyContent: "flex-end" }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            maxHeight: "100%",
            backgroundColor: sheetBg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 16,
          }}
        >
          <View
            style={{
              height: 4,
              width: 42,
              backgroundColor: primarySoft,
              borderRadius: 4,
              alignSelf: "center",
              marginBottom: 12,
            }}
          />
          {scrollable ? (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 12, gap: 12 }}
              style={[
                {
                  backgroundColor: surfaceElevated,
                  borderRadius: 12,
                  padding: 12,
                },
                contentStyle,
              ]}
            >
              {!!title && (
                <H3
                  style={{
                    color: text,
                    fontFamily: "WorkSans_600SemiBold",
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  {title}
                </H3>
              )}
              {!!infoText && (
                <P
                  style={{
                    color: icon,
                    fontFamily: "WorkSans_400Regular",
                    fontSize: 12,
                    lineHeight: 20,
                  }}
                >
                  {infoText}
                </P>
              )}
              {children}
            </ScrollView>
          ) : (
            children
          )}

          {!noCloseButton && (
            <Pressable
              onPress={onClose}
              style={{
                padding: 12,
                alignItems: "center",
                marginTop: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: outline,
              }}
            >
              <P style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
                Close
              </P>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};
