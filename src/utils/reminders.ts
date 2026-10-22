export function normalizeTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) throw new Error('Choose a valid reminder time.');
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23)) throw new Error('Choose a valid reminder time.');
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0);
  return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
}
export function zonedClock(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';
  return { day: get('year') + '-' + get('month') + '-' + get('day'), time: get('hour') + ':' + get('minute') };
}
export function isDue(reminder: { done: boolean; time: string; snoozedUntil?: string | null }, now: Date, timeZone: string): boolean {
  if (reminder.done) return false;
  if (reminder.snoozedUntil) return new Date(reminder.snoozedUntil).getTime() <= now.getTime();
  return normalizeTime(reminder.time) <= zonedClock(now, timeZone).time;
}
export function phoneHref(phone: string): string | null {
  const normalized = phone.replace(/[\s().-]/g, '');
  return /^\+?\d{7,15}$/.test(normalized) ? 'tel:' + normalized : null;
}


export interface ReminderOccurrence {
  occurrence_date: string;
  completed_at: string | null;
  snoozed_until: string | null;
}
export function selectOccurrence(events: ReminderOccurrence[], day: string, timeZone: string): ReminderOccurrence | undefined {
  const today = events.find(event => event.occurrence_date === day);
  if (today) return today;
  return events.find(event => !event.completed_at && event.snoozed_until && zonedClock(new Date(event.snoozed_until), timeZone).day >= day);
}
