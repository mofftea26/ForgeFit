export function getInjectedJS(): string {
  return `
      setTimeout(() => {
        const height = Math.max(
          document.documentElement.scrollHeight,
          document.body?.scrollHeight || 0
        );
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: "height", height }));
      }, 50);
      true;
    `;
}
