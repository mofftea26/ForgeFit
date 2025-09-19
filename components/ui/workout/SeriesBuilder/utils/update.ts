export function replaceAtIndex<T>(arr: T[], index: number, next: T): T[] {
  return arr.map((v, i) => (i === index ? next : v));
}
export function removeById<T extends { id: string }>(
  arr: T[],
  id: string
): T[] {
  return arr.filter((v) => v.id !== id);
}
export function updateById<T extends { id: string }>(
  arr: T[],
  id: string,
  patch: Partial<T>
): T[] {
  return arr.map((v) => (v.id === id ? { ...v, ...patch } : v));
}
