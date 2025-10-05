// src/features/export/utils/inlineImages.ts
import { PrintableProgram } from "./selectors";
import { toDataUrl } from "./toDataUrl";

export async function inlineImages(
  p: PrintableProgram,
  iconDataUrl: string
): Promise<PrintableProgram> {
  const clone: PrintableProgram = JSON.parse(JSON.stringify(p));

  const anyProgram = clone as any;
  const coverRaw =
    anyProgram.imageUrl || anyProgram.coverImage || anyProgram.photo || "";
  const coverData = (await toDataUrl(coverRaw)) || iconDataUrl;
  anyProgram.imageUrl = coverData;

  for (const ph of clone.phases) {
    for (const d of ph.days) {
      if (d.type !== "workout") continue;
      const wd: any = d;

      if (wd.imageUrl) {
        wd.imageUrl = (await toDataUrl(wd.imageUrl)) || iconDataUrl;
      } else {
        wd.imageUrl = iconDataUrl;
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

  return clone;
}
