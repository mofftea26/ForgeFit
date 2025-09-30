import * as React from "react";
import { getInjectedJS } from "../utils/injectedJs";

export function useWebviewHeight() {
  const [webViewHeight, setWebViewHeight] = React.useState(800);

  const onMessage = React.useCallback((e: any) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data?.type === "height" && Number.isFinite(data.height)) {
        setWebViewHeight(Math.max(600, data.height + 40));
      }
    } catch {}
  }, []);

  const injectedJavaScript = React.useMemo(() => getInjectedJS(), []);

  return { webViewHeight, onMessage, injectedJavaScript, setWebViewHeight };
}
