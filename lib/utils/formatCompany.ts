export function formatCompanyName(raw: string): string {
  return raw
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
