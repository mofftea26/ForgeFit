import * as Sharing from "expo-sharing";
import * as React from "react";
import { exportProgramPdf } from "../utils/exportPdf";
import { getProgramImageUrl } from "../utils/getProgramImageUrl";
import { toPrintableProgram } from "../utils/selectors";
import { toDataUrl } from "../utils/toDataUrl";

type Params = {
  programs: any[];
  selectedId?: string;
  clientName?: string;
  details?: any;
  dateMs?: number;
};

export function useShareProgramPdf({
  programs,
  selectedId,
  clientName,
  details,
  dateMs,
}: Params) {
  const handleShare = React.useCallback(async () => {
    if (!selectedId) return;
    try {
      const prog = programs.find((p) => p.id === selectedId);
      if (!prog) return;

      const printable = toPrintableProgram(prog);
      const raw = getProgramImageUrl(printable);
      const dataUrl = raw ? await toDataUrl(raw) : undefined;

      const res = await exportProgramPdf(
        { printable },
        {
          clientName: clientName?.trim() || undefined,
          programImage: dataUrl,
          details,
          dateMs,
        }
      );

      if (res.canShare) {
        await Sharing.shareAsync(res.fileUri, {
          dialogTitle: "Share Program PDF",
          UTI: "com.adobe.pdf",
          mimeType: "application/pdf",
        });
      } else {
        console.log("Sharing not available; file saved at:", res.fileUri);
      }
    } catch (e) {
      console.warn("Share failed", e);
    }
  }, [selectedId, programs, clientName, details, dateMs]);

  return { handleShare };
}
