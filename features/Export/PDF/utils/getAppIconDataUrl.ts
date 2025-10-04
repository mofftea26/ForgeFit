import logoPng from "@/assets/images/pngTitle/logo-color.png";
import { Asset } from "expo-asset";
import { File } from "expo-file-system";

export async function getAppIconDataUrl(_iconModule?: any) {
  const asset = Asset.fromModule(logoPng);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  const uri = asset.localUri!;
  const b64 = await new File(uri).base64();

  return `data:image/png;base64,${b64}`;
}
