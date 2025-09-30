import * as React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { useBuildProgramHtml } from "../hooks/useBuildProgramHtml";
import { useProgramSelection } from "../hooks/useProgramSelection";
import { useShareProgramPdf } from "../hooks/useShareProgramPdf";
import { useWebviewHeight } from "../hooks/useWebviewHeight";
import { CoverOptions } from "../htmlBuilder";
import { PdfTopBar } from "./PdfTopBar";
import { ProgramSelect } from "./ProgramSelect";

type Props = {
  programId?: string;
  clientName?: string;
  programImage?: string;
  details?: CoverOptions["details"];
  dateMs?: number;
  style?: any;
};

export function ProgramPdfPreview({
  programId,
  clientName: clientNameProp,
  details,
  dateMs,
  style,
}: Props) {
  const [clientName, setClientName] = React.useState(clientNameProp || "");
  const [shareLoading, setShareLoading] = React.useState(false); // ← NEW

  const { programs, selectedId, setSelectedId, currentProgram } =
    useProgramSelection(programId);

  const { html, buildHtml } = useBuildProgramHtml({
    currentProgram,
    clientName,
    details,
    dateMs,
  });

  const { handleShare } = useShareProgramPdf({
    programs,
    selectedId,
    clientName,
    details,
    dateMs,
  });

  const { webViewHeight, onMessage, injectedJavaScript } = useWebviewHeight();

  // Wrap sharing with a loading guard
  const onShare = React.useCallback(async () => {
    if (shareLoading) return; // guard
    setShareLoading(true);
    try {
      await handleShare();
    } finally {
      setShareLoading(false);
    }
  }, [handleShare, shareLoading]);

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#0B1420" }, style]}>
      <PdfTopBar
        clientName={clientName}
        onClientNameChange={setClientName}
        onRefresh={buildHtml}
        onShare={onShare} // ← wrapped with loading
        shareLoading={shareLoading} // ← NEW
      >
        <ProgramSelect
          programs={programs}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </PdfTopBar>

      <View style={{ flex: 1, backgroundColor: "#0B1420" }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          style={{
            width: "100%",
            height: webViewHeight,
            backgroundColor: "transparent",
          }}
          onMessage={onMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled
          allowFileAccess
          setSupportMultipleWindows={false}
          mixedContentMode="always"
        />
      </View>
    </SafeAreaView>
  );
}
