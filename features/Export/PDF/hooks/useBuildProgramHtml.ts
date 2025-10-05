import * as React from "react";
import { CoverOptions, buildProgramHtml } from "../htmlBuilder";
import { INSTRUCTIONS } from "../htmlBuilder/appendix/instructionsData";
import { applyScreenPaging } from "../utils/applyScreenPaging";
import { getAppIconDataUrl } from "../utils/getAppIconDataUrl";
import { inlineImages } from "../utils/inlineImages";
import { toPrintableProgram } from "../utils/selectors";

type Params = {
  currentProgram: any | undefined;
  clientName?: string;
  details?: CoverOptions["details"];
  dateMs?: number;
};

export function useBuildProgramHtml({
  currentProgram,
  clientName,
  details,
  dateMs,
}: Params) {
  const [html, setHtml] = React.useState<string>("");

  const buildHtml = React.useCallback(async () => {
    if (!currentProgram) {
      setHtml("<html><body><h3>No program found</h3></body></html>");
      return;
    }

    try {
      let iconDataUrl = "";
      try {
        iconDataUrl = await getAppIconDataUrl();
      } catch {
        iconDataUrl =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////GwAFgwJ/1n0iLQAAAABJRU5ErkJggg==";
      }

      const printable = toPrintableProgram(currentProgram);

      let withImages = printable as any;
      try {
        withImages = await inlineImages(printable, iconDataUrl);
      } catch {
        withImages = printable;
      }

      const cover: CoverOptions = {
        clientName: clientName?.trim() || undefined,
        programImage: (withImages as any).imageUrl,
        details,
        dateMs,
      };

      const raw = buildProgramHtml(withImages, iconDataUrl, cover, {
        showGeneralInfo: true,
        instructions: INSTRUCTIONS,
      });
      const paged = applyScreenPaging(raw);
      setHtml(paged);
    } catch (e) {
      console.warn("Build HTML failed", e);
      setHtml(
        "<html><body><h3>Failed to build preview</h3><p>Try again.</p></body></html>"
      );
    }
  }, [currentProgram, clientName, details, dateMs]);

  React.useEffect(() => {
    void buildHtml();
  }, [buildHtml]);

  return { html, buildHtml, setHtml };
}
