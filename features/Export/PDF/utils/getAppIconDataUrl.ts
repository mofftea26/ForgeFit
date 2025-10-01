import { Asset } from "expo-asset";
import { File } from "expo-file-system";

export async function getAppIconDataUrl(iconModule: any) {
  const asset = Asset.fromModule(iconModule);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  const uri = asset.localUri || asset.uri;

  const b64 = await new File(uri).base64();

  const mime =
    uri.endsWith(".jpg") || uri.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${b64}`;
}
