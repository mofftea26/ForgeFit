import * as ImagePicker from "expo-image-picker";

export function useDayImage() {
  const pick = async (): Promise<string | undefined> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      return res.assets[0].uri;
    }
  };
  return { pick };
}
