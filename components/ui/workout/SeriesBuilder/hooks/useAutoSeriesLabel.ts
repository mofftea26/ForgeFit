export function useAutoSeriesLabel() {
  const fromIndex = (i: number) => String.fromCharCode("A".charCodeAt(0) + i);
  return { fromIndex };
}
