import type { PrintableProgram } from "./selectors";

export function getProgramImageUrl(
  p: PrintableProgram,
  override?: string,
  fallback?: string
) {
  if (override) return override;
  const anyp = p as any;

  const found =
    anyp.image ||
    anyp.imageUrl ||
    anyp.coverImage ||
    anyp.photo ||
    anyp.thumbnail ||
    anyp.banner ||
    "";

  return found || fallback || "";
}
