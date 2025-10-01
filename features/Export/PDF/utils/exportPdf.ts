import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CoverOptions, buildProgramHtml } from "../htmlBuilder";
import { INSTRUCTIONS } from "../htmlBuilder/appendix/instructionsData";
import { getAppIconDataUrl } from "./getAppIconDataUrl";
import { inlineImages } from "./inlineImages";
import { toPrintableProgram } from "./selectors";

type ExportSource =
  | { program: any }
  | { printable: ReturnType<typeof toPrintableProgram> };

type ExportOpts = {
  clientName?: string;
  programImage?: string;
  details?: CoverOptions["details"];
  dateMs?: number;
};

export async function exportProgramPdf(src: ExportSource, opts?: ExportOpts) {
  const printable =
    "printable" in src ? src.printable : toPrintableProgram(src.program);

  const iconModule = require("@/assets/images/pngTitle/logo-color.png");
  const iconDataUrl = await getAppIconDataUrl(iconModule);
  const printableWithImages = await inlineImages(printable, iconDataUrl);

  const cover: CoverOptions = {
    clientName: opts?.clientName,
    programImage: opts?.programImage ?? (printableWithImages as any).imageUrl,
    details: opts?.details,
    dateMs: opts?.dateMs,
  };

  const html = buildProgramHtml(printableWithImages, iconDataUrl, cover, {
    showGeneralInfo: true,
    instructions: INSTRUCTIONS,
  });

  const { uri: tmpUri } = await Print.printToFileAsync({ html });

  try {
    const title = (printable.title || "Program").replace(/[^\w\-]+/g, "_");
    const date = new Date().toISOString().split("T")[0];
    const out = new File(Paths.document, `${title}_${date}.pdf`);
    if (out.exists) out.delete();
    new File(tmpUri).move(out);
    return { fileUri: out.uri, canShare: await Sharing.isAvailableAsync() };
  } catch {
    return { fileUri: tmpUri, canShare: await Sharing.isAvailableAsync() };
  }
}
