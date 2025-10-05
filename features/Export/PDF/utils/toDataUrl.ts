import * as FS from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

function inferMimeFromPath(p: string) {
  const q = p.split("?")[0].toLowerCase();
  if (q.endsWith(".jpg") || q.endsWith(".jpeg")) return "image/jpeg";
  if (q.endsWith(".png")) return "image/png";
  if (q.endsWith(".webp")) return "image/webp";
  if (q.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

async function resizeToBase64(uri: string): Promise<string | undefined> {
  try {
    const hasNewApi =
      typeof (ImageManipulator as any).manipulate === "function";

    if (hasNewApi) {
      const result = await (ImageManipulator as any).manipulate(
        uri,
        [{ resize: { width: 1600 } }],
        { compress: 0.9, format: "jpeg", base64: true }
      );
      return result?.base64
        ? `data:image/jpeg;base64,${result.base64}`
        : undefined;
    }

    const result = await (ImageManipulator as any).manipulateAsync(
      uri,
      [{ resize: { width: 1600 } }],
      {
        compress: 0.9,
        format: (ImageManipulator as any).SaveFormat?.JPEG ?? "jpeg",
        base64: true,
      }
    );
    return result?.base64
      ? `data:image/jpeg;base64,${result.base64}`
      : undefined;
  } catch {
    return undefined;
  }
}

export async function toDataUrl(
  src?: string | null
): Promise<string | undefined> {
  if (!src) return undefined;
  if (src.startsWith("data:")) return src;

  try {
    let localUri = src;

    if (src.startsWith("http://") || src.startsWith("https://")) {
      FS.Paths.cache.create();
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
