import * as ImagePicker from "expo-image-picker";

export function useImagePicker() {
  const pickImage = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return null;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    return !res.canceled && res.assets?.[0]?.uri ? res.assets[0].uri : null;
  };
  return { pickImage };
}
