import * as FileSystem from "expo-file-system/legacy";

function inferMimeFromPath(p: string) {
  const q = p.split("?")[0].toLowerCase();
  if (q.endsWith(".jpg") || q.endsWith(".jpeg")) return "image/jpeg";
  if (q.endsWith(".png")) return "image/png";
  if (q.endsWith(".webp")) return "image/webp";
  if (q.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function toDataUrl(
  src?: string | null
): Promise<string | undefined> {
  if (!src) return undefined;
  if (src.startsWith("data:")) return src;

  try {
    let localPath = src;

    if (src.startsWith("http://") || src.startsWith("https://")) {
      const filename = encodeURIComponent(src).slice(0, 80); // short-ish
      const target =
        (FileSystem.cacheDirectory ?? FileSystem.documentDirectory) + filename;
      try {
        const { uri } = await FileSystem.downloadAsync(src, target);
        localPath = uri;
      } catch {}
    }

    const b64 = await FileSystem.readAsStringAsync(localPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const mime = inferMimeFromPath(src);
    return `data:${mime};base64,${b64}`;
  } catch {
    return undefined;
  }
}
