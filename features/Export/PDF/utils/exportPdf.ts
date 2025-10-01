import { Directory, File, Paths } from "expo-file-system";
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

  // 1) Create the PDF to a tmp file (cache)
  const { uri: tmpUri } = await Print.printToFileAsync({ html });

  // 2) Pick a safe output directory (prefer Documents, fall back to Cache)
  const documents = Paths.document; // Directory
  const cache = Paths.cache; // Directory
  const baseDir: Directory = documents ?? cache;

  const title = (printable.title || "Program").replace(/[^\w\-]+/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const outFile = new File(baseDir, `${title}_${date}.pdf`);

  try {
    // If a file with the same name exists, delete it first
    if (outFile.exists) {
      outFile.delete();
    }

    // Move tmp -> final location
    const tmpFile = new File(tmpUri);
    tmpFile.move(outFile); // you can also pass baseDir to move into a dir and then rename

    return { fileUri: outFile.uri, canShare: await Sharing.isAvailableAsync() };
  } catch {
    // If anything fails, just share the tmp file
    return { fileUri: tmpUri, canShare: await Sharing.isAvailableAsync() };
  }
}
