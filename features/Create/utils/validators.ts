export function canProceedBasics(title: string, weeks: number) {
  return title.trim().length > 0 && weeks > 0;
}
