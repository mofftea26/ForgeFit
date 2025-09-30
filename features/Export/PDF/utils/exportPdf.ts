import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CoverOptions, buildProgramHtml } from "../htmlBuilder";
import { getAppIconDataUrl } from "./getAppIconDataUrl";
import { inlineImages } from "./inlineImages";
import { getProgramById, toPrintableProgram } from "./selectors";

export async function exportProgramPdf(
  programId: string,
  opts?: {
    clientName?: string;
    programImage?: string;
    details?: CoverOptions["details"];
    dateMs?: number;
  }
) {
  const prog = getProgramById(programId);
  if (!prog) throw new Error("Program not found.");

  const printable = toPrintableProgram(prog);

  const iconModule = require("@/assets/images/pngTitle/logo-color.png");
  const iconDataUrl = await getAppIconDataUrl(iconModule);

  const printableWithImages = await inlineImages(printable, iconDataUrl);

  const cover: CoverOptions = {
    clientName: opts?.clientName,
    programImage: opts?.programImage ?? (printableWithImages as any).imageUrl,
    details: opts?.details,
    dateMs: opts?.dateMs,
  };

  const html = buildProgramHtml(printableWithImages, iconDataUrl, cover);

  const { uri: tmpUri } = await Print.printToFileAsync({ html });

  const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? null;
  if (!dir)
    return { fileUri: tmpUri, canShare: await Sharing.isAvailableAsync() };

  const title = (printable.title || "Program").replace(/[^\w\-]+/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const outPath = `${dir}${title}_${date}.pdf`;

  try {
    const info = await FileSystem.getInfoAsync(outPath);
    if (info.exists)
      await FileSystem.deleteAsync(outPath, { idempotent: true });
    await FileSystem.moveAsync({ from: tmpUri, to: outPath });
    return { fileUri: outPath, canShare: await Sharing.isAvailableAsync() };
  } catch {
    return { fileUri: tmpUri, canShare: await Sharing.isAvailableAsync() };
  }
}
