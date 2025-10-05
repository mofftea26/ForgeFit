import * as FS from "expo-file-system";
import { manipulate, SaveFormat } from "expo-image-manipulator";

function inferMimeFromPath(p: string) {
  const q = p.split("?")[0].toLowerCase();
  if (q.endsWith(".jpg") || q.endsWith(".jpeg")) return "image/jpeg";
  if (q.endsWith(".png")) return "image/png";
  if (q.endsWith(".webp")) return "image/webp";
  if (q.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

async function resizeToBase64(uri: string): Promise<string | undefined> {
  const mime = inferMimeFromPath(uri);
  const isPngCandidate =
    mime === "image/png" &&
    (!uri.startsWith("http") ||
      /(?:logo|icon|badge)\b/i.test(uri.split("?")[0]) ||
      uri.startsWith("asset://"));

  const targetWidth = 1024;

  const ctx = manipulate(uri);
  const ref = await ctx
    .resize({ width: targetWidth, height: null })
    .renderAsync();

  const format: SaveFormat = isPngCandidate ? "png" : "jpeg";
  const compress = isPngCandidate ? 1 : 0.82;

  const result = await ref.saveAsync({ base64: true, format, compress });
  const outMime = format === "png" ? "image/png" : "image/jpeg";
  return result.base64 ? `data:${outMime};base64,${result.base64}` : undefined;
}

export async function toDataUrl(
  src?: string | null
): Promise<string | undefined> {
  if (!src) return undefined;
  if (src.startsWith("data:")) return src;

  try {
    let localUri = src;

    if (src.startsWith("http://") || src.startsWith("https://")) {
      FS.Paths.cache.create(); // idempotent
      const { uri } = await FS.File.downloadFileAsync(src, FS.Paths.cache);
      localUri = uri;
    }

    if (
      localUri.startsWith("file://") ||
      localUri.startsWith("content://") ||
      localUri.startsWith("asset://")
    ) {
      const dataUrl = await resizeToBase64(localUri);
      if (dataUrl) return dataUrl;
    }

    const b64 = await new FS.File(localUri).base64();
    const mime = inferMimeFromPath(src);
    return `data:${mime};base64,${b64}`;
  } catch {
    return undefined;
  }
}
