/**
 * Formats a UTC ISO timestamp for local display. All timestamps are
 * stored/transmitted as UTC; formatting to local time is a display-only concern.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}
