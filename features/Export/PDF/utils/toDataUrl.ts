import { File, Paths } from "expo-file-system";

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
    let localUri = src;

    if (src.startsWith("http://") || src.startsWith("https://")) {
      const cacheDir = Paths.cache;
      cacheDir.create();
      const downloaded = await File.downloadFileAsync(src, cacheDir);

      localUri = downloaded.uri;
    }

    const b64 = await new File(localUri).base64();

    const mime = inferMimeFromPath(src);
    return `data:${mime};base64,${b64}`;
  } catch {
    return undefined;
  }
}
