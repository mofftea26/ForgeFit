// src/features/export/utils/inlineImages.ts
import { PrintableProgram } from "./selectors";
import { toDataUrl } from "./toDataUrl";

/**
 * Returns a deep-cloned PrintableProgram where imageUrl fields are converted to data URLs.
 * Falls back to `iconDataUrl` placeholder when conversion fails or url is empty.
 */
export async function inlineImages(
  p: PrintableProgram,
  iconDataUrl: string
): Promise<PrintableProgram> {
  // deep clone (structuredClone on modern RN; fallback simple JSON clone)
  const clone: PrintableProgram = JSON.parse(JSON.stringify(p));

  // Program-level (cover)
  const programAny = clone as any;
  if (programAny.imageUrl || programAny.coverImage || programAny.photo) {
    const raw =
      programAny.imageUrl || programAny.coverImage || programAny.photo || "";
    programAny.imageUrl = (await toDataUrl(raw)) || iconDataUrl;
  } else {
    programAny.imageUrl = iconDataUrl;
  }

  for (const ph of clone.phases) {
    for (const d of ph.days) {
      if (d.type === "workout") {
        const wd: any = d;
        if (wd.imageUrl) {
          wd.imageUrl = (await toDataUrl(wd.imageUrl)) || iconDataUrl;
        }
        for (const s of wd.series) {
          for (const e of s.items as any[]) {
            if (e.imageUrl) {
              e.imageUrl = (await toDataUrl(e.imageUrl)) || iconDataUrl;
            } else {
              e.imageUrl = iconDataUrl;
            }
          }
        }
      }
    }
  }
  return clone;
}
