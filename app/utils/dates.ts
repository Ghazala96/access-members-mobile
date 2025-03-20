import { DateTime } from 'luxon';

export function formatDate(isoString: string) {
  return DateTime.fromISO(isoString).toFormat("MMMM dd, yyyy 'at' hh:mm a");
}
