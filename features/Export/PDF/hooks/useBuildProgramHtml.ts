import { useCallback, useEffect, useState } from "react";
import { CoverOptions, buildProgramHtml } from "../htmlBuilder";
import { INSTRUCTIONS } from "../htmlBuilder/appendix/instructionsData";
import { applyScreenPaging } from "../utils/applyScreenPaging"; // keep paging with awaitImages
import { getAppIconDataUrl } from "../utils/getAppIconDataUrl";
import { toPrintableProgram } from "../utils/selectors";

type Params = {
  currentProgram: any | undefined;
  clientName: string;
  details: CoverOptions["details"];
  dateMs?: number;
};

export function useBuildProgramHtml({
  currentProgram,
  clientName,
  details,
  dateMs,
}: Params) {
  const [html, setHtml] = useState<string>("");

  const buildHtml = useCallback(async () => {
    if (!currentProgram) {
      setHtml("<html><body><h3>No program found</h3></body></html>");
      return;
    }
    try {
      // small placeholder (data URL) for when an image is missing
      let iconDataUrl = "";
      try {
        iconDataUrl = await getAppIconDataUrl();
      } catch {
        iconDataUrl =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////GwAFgwJ/1n0iLQAAAABJRU5ErkJggg==";
      }

      // ✅ DO NOT inline for preview — use raw URIs so they load like the cover did
      const printable = toPrintableProgram(currentProgram);

      // Build the cover using the program’s own image URL (or fallback to icon)
      const cover: CoverOptions = {
        clientName: clientName?.trim() || undefined,
        // NOTE: we do not override with dataUrl here; cover uses raw URI like before
        programImage: undefined,
        details,
        dateMs,
      };

      const raw = buildProgramHtml(printable, iconDataUrl, cover, {
        showGeneralInfo: true,
        instructions: INSTRUCTIONS,
      });

      // keep the paged preview but with image-await to avoid flicker
      const paged = applyScreenPaging(raw);
      setHtml(paged);
    } catch (e) {
      console.warn("Build HTML failed", e);
      setHtml("<html><body><h3>Failed to build preview</h3></body></html>");
    }
  }, [currentProgram, clientName, details, dateMs]);

  useEffect(() => {
    void buildHtml();
  }, [buildHtml]);

  return { html, buildHtml, setHtml };
}
