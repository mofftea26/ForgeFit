import { Directory, File, Paths } from "expo-file-system";

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

    // If remote, download to cache using the modern API
    if (src.startsWith("http://") || src.startsWith("https://")) {
      const cacheDir = Paths.cache; // Directory
      cacheDir.create(); // idempotent – will throw only if not permitted

      // Use a short, safe filename
      const filename = encodeURIComponent(src).slice(0, 80);
      const downloaded = await File.downloadFileAsync(
        src,
        new Directory(cacheDir, "")
      ); // to cache root
      // If you need a specific filename:
      // const out = new File(cacheDir, filename);
      // downloaded.move(out);
      localUri = downloaded.uri;
    }

    // Read as base64 via File
    const b64 = await new File(localUri).base64();

    const mime = inferMimeFromPath(src);
    return `data:${mime};base64,${b64}`;
  } catch {
    return undefined;
  }
}
