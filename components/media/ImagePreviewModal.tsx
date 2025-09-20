import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Pencil, X } from "lucide-react-native";
import React from "react";
import { Image, Modal, Pressable, View } from "react-native";
import { P } from "../ui/Typography";

type Props = {
  visible: boolean;
  uri?: string;
  onRequestClose: () => void;
  onChange?: (nextUri: string) => void;
  isEditable?: boolean;
};

export const ImagePreviewModal: React.FC<Props> = ({
  visible,
  uri,
  onRequestClose,
  onChange,
  isEditable = true,
}) => {
  const sheetBg = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const scrim = useThemeColor({}, "scrim");
  const mediaBg = useThemeColor({}, "mediaBg");
  const onTint = useThemeColor({}, "onTint"); // for the floating pencil

  const pickNewImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onChange?.(res.assets[0].uri);
      await Haptics.selectionAsync();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: scrim,
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: sheetBg,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: outline,
            }}
          >
            <P
              style={{ color: text, fontFamily: "Syne_700Bold", fontSize: 16 }}
            >
              Image preview
            </P>
            <View style={{ flex: 1 }} />
            <Pressable onPress={onRequestClose} hitSlop={8}>
              <X size={18} color={muted} />
            </Pressable>
          </View>

          {/* Media area */}
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
              backgroundColor: mediaBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {uri ? (
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            ) : (
              <P style={{ color: text }}>No image selected</P>
            )}

            {isEditable && (
              <Pressable
                onPress={pickNewImage}
                hitSlop={8}
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: scrim,
                  borderWidth: 1,
                  borderColor: outline,
                }}
              >
                <Pencil size={18} color={onTint} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
